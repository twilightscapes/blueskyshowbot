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
      
      try {
        const searchResults = await this.agent.app.bsky.feed.searchPosts({
          q: hashtag,
          limit: 25
        });

        if (!searchResults.data.posts || searchResults.data.posts.length === 0) {
          console.log(`No posts found for ${hashtag}`);
          continue;
        }

        console.log(`Found ${searchResults.data.posts.length} posts for ${hashtag}`);

        for (const post of searchResults.data.posts) {
          const processedThisHashtag = await this.processPost(post, hashtag);
          if (processedThisHashtag) {
            totalProcessed++;
          }
        }

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
      // Fetch the webpage to get title and description
      const response = await fetch(url);
      const html = await response.text();
      
      // Basic HTML parsing for title and description
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                               html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
      
      const title = titleMatch ? titleMatch[1].trim() : 'BlueSky Show';
      const description = descriptionMatch ? descriptionMatch[1].trim() : 'Join us for live discussions every Friday at 3:30 PM Central!';
      
      return {
        uri: url,
        title: title.substring(0, 300), // Bluesky limits
        description: description.substring(0, 1000)
      };
    } catch (error) {
      console.error('Error creating link card:', error);
      // Return basic link card as fallback
      return {
        uri: url,
        title: 'BlueSky Show',
        description: 'Join us for live discussions every Friday at 3:30 PM Central!'
      };
    }
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

  private isInCooldown(hashtag: string): boolean {
    // Since we're running every 2 minutes and have a 30-minute cooldown,
    // we can simplify this by checking the current time
    // For now, let's disable cooldown and rely on the reply checking
    return false;
  }
}
