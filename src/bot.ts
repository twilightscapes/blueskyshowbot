import { BskyAgent } from '@atproto/api';
import { BotConfig } from './types';
import { getRandomResponse, getCooldownMinutes, HASHTAG_RESPONSES } from './responses';

export class BlueskyHashtagBot {
  private agent: BskyAgent;
  private config: BotConfig;

  constructor(config: BotConfig) {
    this.agent = new BskyAgent({
      service: 'https://bsky.social'
    });
    this.config = config;
  }

  async start(): Promise<void> {
    console.log(`Starting BlueSky Hashtag Bot as ${this.config.handle}...`);
    await this.login();
    await this.runSingleCheck();
  }

  private async login(): Promise<void> {
    try {
      await this.agent.login({
        identifier: this.config.handle,
        password: this.config.password
      });
      console.log(`Successfully logged in to Bluesky as: ${this.config.handle}`);
      
      // Get our profile to confirm the handle
      const profile = await this.agent.getProfile({ actor: this.config.handle });
      console.log(`✅ Confirmed bot profile: @${profile.data.handle}`);
      
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  }

  async runSingleCheck(): Promise<void> {
    console.log(`Running hashtag check for: ${this.config.hashtags.join(', ')}`);
    
    try {
      await this.checkForHashtags();
      console.log('Single check completed');
    } catch (error) {
      console.error('Failed during hashtag check:', error);
      throw error;
    }
  }

  private async checkForHashtags(): Promise<void> {
    let totalProcessed = 0;

    for (const hashtag of this.config.hashtags) {
      console.log(`🔍 Searching for hashtag: ${hashtag}`);
      
      // Generate common case variations for the search
      const hashtagVariations = this.generateHashtagVariations(hashtag);
      console.log(`🔤 Searching variations: ${hashtagVariations.join(', ')}`);
      
      const allPosts: any[] = [];
      
      // Search for each variation
      for (const variation of hashtagVariations) {
        try {
          const searchResults = await this.agent.app.bsky.feed.searchPosts({
            q: variation,
            limit: 25
          });

          if (searchResults.data.posts && searchResults.data.posts.length > 0) {
            console.log(`Found ${searchResults.data.posts.length} posts for ${variation}`);
            allPosts.push(...searchResults.data.posts);
          }
        } catch (error) {
          console.error(`Error searching for ${variation}:`, error);
        }
      }

      // Remove duplicates based on post URI
      const uniquePosts = allPosts.filter((post, index, self) => 
        index === self.findIndex(p => p.uri === post.uri)
      );

      if (uniquePosts.length === 0) {
        console.log(`No posts found for any variation of ${hashtag}`);
        continue;
      }

      console.log(`Found ${uniquePosts.length} unique posts for ${hashtag} variations`);

      // Filter posts to only include those from the last X hours (configurable, default 24 hours)
      const maxAgeHours = this.config.maxPostAgeHours || 24;
      const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
      const recentPosts = uniquePosts.filter(post => {
          const postDate = new Date(post.indexedAt);
          const isRecent = postDate > cutoffTime;
          if (!isRecent) {
            console.log(`⏰ Skipping old post from ${postDate.toISOString()} (older than ${maxAgeHours} hours)`);
          }
          return isRecent;
        });

        console.log(`📅 ${recentPosts.length} posts are from the last ${maxAgeHours} hours`);

        for (const post of recentPosts) {
          const processedThisHashtag = await this.processPost(post, hashtag);
          if (processedThisHashtag) {
            totalProcessed++;
          }
        }

      try {
        // Error handling for individual hashtag searches is handled above
      } catch (error) {
        console.error(`Error searching for ${hashtag}:`, error);
      }
    }

    console.log(`📊 Total posts processed: ${totalProcessed}`);
  }

  private async processPost(post: any, hashtag: string): Promise<boolean> {
    const text = post.record?.text || '';
    const postUri = post.uri;

    // Check for exact hashtag match (not substring match)
    const hashtagRegex = new RegExp(`\\${hashtag}(?=\\s|$|[^a-zA-Z0-9])`, 'i');
    if (!hashtagRegex.test(text)) {
      console.log(`⏭️ SKIPPING - hashtag "${hashtag}" not found as complete word in: "${text.substring(0, 100)}..."`);
      return false;
    }

    console.log(`🎯 Found exact hashtag "${hashtag}" in post: "${text.substring(0, 100)}..."`);

    // Check if we've already replied to this post for this hashtag
    if (await this.hasRecentReply(postUri, hashtag)) {
      console.log(`⏭️ SKIPPING ${hashtag} on post (already replied recently)`);
      return false;
    }

    // Check cooldown for this hashtag
    if (this.isInCooldown(hashtag)) {
      console.log(`⏳ SKIPPING ${hashtag} (in cooldown)`);
      return false;
    }

    console.log(`✅ Processing NEW post with ${hashtag}: ${text.substring(0, 100)}...`);

    try {
      await this.replyToPost(post, hashtag);
      console.log(`✅ Successfully replied to post with ${hashtag}`);
      return true;
    } catch (error) {
      console.error(`❌ Error replying to post:`, error);
      return false;
    }
  }

  private async replyToPost(originalPost: any, hashtag: string): Promise<void> {
    const response = getRandomResponse(hashtag);
    const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
    
    console.log(`📤 Replying with: ${response}`);
    console.log(`🎯 Reply target - URI: ${originalPost.uri}`);
    console.log(`🎯 Reply target - CID: ${originalPost.cid}`);

    // Check if the original post is already a reply to determine the root
    const originalRecord = originalPost.record;
    let rootUri = originalPost.uri;
    let rootCid = originalPost.cid;
    
    if (originalRecord?.reply?.root) {
      // This post is already a reply, use its root
      rootUri = originalRecord.reply.root.uri;
      rootCid = originalRecord.reply.root.cid;
      console.log(`📎 Post is a reply, using root: ${rootUri}`);
    } else {
      console.log(`📎 Post is original, using as root: ${rootUri}`);
    }

    const replyPost: any = {
      text: response,
      reply: {
        root: {
          uri: rootUri,
          cid: rootCid
        },
        parent: {
          uri: originalPost.uri,
          cid: originalPost.cid
        }
      }
    };

    console.log(`📋 Reply structure:`, JSON.stringify({
      root: { uri: rootUri, cid: rootCid },
      parent: { uri: originalPost.uri, cid: originalPost.cid }
    }, null, 2));

    // Add link card if configured for this hashtag
    if (config?.links && config.links.length > 0) {
      const randomLink = config.links[Math.floor(Math.random() * config.links.length)];
      console.log(`🔗 Adding link card for: ${randomLink}`);
      
      try {
        const linkCard = await this.createLinkCard(randomLink);
        if (linkCard) {
          replyPost.embed = {
            $type: 'app.bsky.embed.external',
            external: linkCard
          };
        }
      } catch (error) {
        console.error('❌ Failed to create link card:', error);
        // Continue without link card if it fails
      }
    }

    const postResult = await this.agent.post(replyPost);
    console.log(`✅ Reply posted successfully!`);
    console.log(`📍 Reply URI: ${postResult.uri}`);
    console.log(`🔗 Reply CID: ${postResult.cid}`);
  }

  private async createLinkCard(url: string): Promise<any> {
    try {
      console.log(`🔗 Creating link card for: ${url}`);
      
      // Fetch the webpage to get title and description
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BlueSkyBot/1.0)'
        }
      });
      const html = await response.text();
      
      // Enhanced HTML parsing for better Open Graph support
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                         html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
      const descriptionMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                               html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      const imageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      
      let title = titleMatch ? titleMatch[1].trim() : 'The Bluesky Show';
      let description = descriptionMatch ? descriptionMatch[1].trim() : 'Join us for live discussions every Friday at 3:30 PM Central!';
      
      // Decode HTML entities
      title = this.decodeHtmlEntities(title);
      description = this.decodeHtmlEntities(description);
      
      const linkCard: any = {
        uri: url,
        title: title.substring(0, 300), // Bluesky limits
        description: description.substring(0, 1000)
      };
      
      // Add thumbnail if found
      if (imageMatch && imageMatch[1]) {
        const imageUrl = imageMatch[1].trim();
        console.log(`🖼️ Found thumbnail: ${imageUrl}`);
        
        try {
          // Fetch and upload the image to Bluesky
          const imageResponse = await fetch(imageUrl);
          if (imageResponse.ok) {
            const imageBuffer = await imageResponse.arrayBuffer();
            const imageBlob = new Uint8Array(imageBuffer);
            
            // Upload image to Bluesky
            const uploadResponse = await this.agent.uploadBlob(imageBlob, {
              encoding: 'image/jpeg' // or detect from response headers
            });
            
            if (uploadResponse.success) {
              linkCard.thumb = uploadResponse.data.blob;
              console.log(`✅ Thumbnail uploaded successfully`);
            }
          }
        } catch (imageError) {
          console.log(`⚠️ Could not process thumbnail: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
        }
      }
      
      console.log(`📝 Link card created - Title: "${title}", Description: "${description}"`);
      
      return linkCard;
    } catch (error) {
      console.error('❌ Error creating link card:', error);
      // Return basic link card as fallback
      return {
        uri: url,
        title: 'The Bluesky Show',
        description: 'Join us for live discussions every Friday at 3:30 PM Central!'
      };
    }
  }

  private decodeHtmlEntities(text: string): string {
    const entities: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&#x27;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    };
    
    return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
      return entities[entity] || entity;
    });
  }

  private async hasRecentReply(postUri: string, hashtag: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking if we've already replied to: ${postUri}`);
      console.log(`🤖 Our bot handle: ${this.config.handle}`);
      
      // Get the post thread to see replies
      const threadResponse = await this.agent.app.bsky.feed.getPostThread({
        uri: postUri,
        depth: 2  // Get deeper replies to be sure
      });

      if (!threadResponse.data.thread) {
        console.log(`❌ Could not fetch thread for post`);
        return false;
      }

      const thread = threadResponse.data.thread as any;
      const replies = thread.replies || [];
      
      console.log(`📊 Found ${replies.length} replies to check`);
      
      // Check if any reply is from our bot
      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];
        const replyAuthor = reply.post?.author?.handle;
        const replyText = reply.post?.record?.text || '';
        
        console.log(`  Reply ${i + 1}: @${replyAuthor} - "${replyText.substring(0, 50)}..."`);
        
        if (replyAuthor === this.config.handle) {
          console.log(`✅ FOUND existing reply from our bot (@${replyAuthor})`);
          console.log(`✅ Reply text: "${replyText.substring(0, 100)}..."`);
          return true;
        }
      }
      
      console.log(`🆕 No previous replies from our bot (@${this.config.handle}) found`);
      return false;
    } catch (error) {
      console.error(`❌ Error checking for previous replies:`, error);
      // On error, assume we HAVE replied to avoid spam
      console.log(`🛡️ Assuming we've already replied due to error (safety measure)`);
      return true;
    }
  }

  private generateHashtagVariations(hashtag: string): string[] {
    // Remove # if present to work with the base word
    const baseWord = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    const hashtagBase = '#' + baseWord;
    
    // Generate common case variations
    const variations = [
      hashtagBase.toLowerCase(),           // #theblueskyshow
      hashtagBase.toUpperCase(),           // #THEBLUESKYSHOW
      '#' + baseWord.charAt(0).toUpperCase() + baseWord.slice(1).toLowerCase(), // #Theblueskyshow
      '#' + baseWord.split('').map((char, i) => 
        i === 0 || baseWord[i-1] === '' ? char.toUpperCase() : char.toLowerCase()
      ).join(''), // Handle camelCase variations
    ];

    // Add specific common variations for "theblueskyshow"
    if (baseWord.toLowerCase() === 'theblueskyshow') {
      variations.push(
        '#TheBlueSkyShow',     // PascalCase
        '#theBlueskyShow',     // camelCase
        '#TheBlueSKYShow',     // Mixed case
        '#TheBlueSkYShow',     // Alternative mixed
      );
    }

    // Remove duplicates and return
    return [...new Set(variations)];
  }

  private isInCooldown(hashtag: string): boolean {
    // Since we're running every 2 minutes and have a 30-minute cooldown,
    // we can simplify this by checking the current time
    // For now, let's disable cooldown and rely on the reply checking
    return false;
  }
}

// Simple export function for Netlify Functions
export async function runBot(): Promise<void> {
  const maxPostAgeHours = parseInt(process.env.MAX_POST_AGE_HOURS || '24', 10);
  
  const config: BotConfig = {
    handle: process.env.BLUESKY_USERNAME || '',
    password: process.env.BLUESKY_PASSWORD || '',
    hashtags: ['#theblueskyshow'],
    responses: [], // Uses HASHTAG_RESPONSES from responses.ts
    defaultCooldownMinutes: 30,
    maxPostAgeHours: maxPostAgeHours
  };

  console.log(`🔧 Bot configured to process posts from the last ${maxPostAgeHours} hours`);

  const bot = new BlueskyHashtagBot(config);
  await bot.start();
}
