import { BskyAgent } from '@atproto/api';
import { BotConfig } from './types';
import { getRandomResponse, getCooldownMinutes, HASHTAG_RESPONSES } from './responses';

interface ReplyRecord {
  postUri: string;
  hashtag: string;
  timestamp: number;
}

export class BlueskyHashtagBot {
  private agent: BskyAgent;
  private config: BotConfig;
  private replyHistory: ReplyRecord[] = [];

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
      console.log('Successfully logged in to Bluesky');
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
    this.cleanupOldReplies();
  }

  private async processPost(post: any, hashtag: string): Promise<boolean> {
    const text = post.record?.text || '';
    const postUri = post.uri;

    // Check if the hashtag is actually in the text (case insensitive)
    if (!text.toLowerCase().includes(hashtag.toLowerCase())) {
      return false;
    }

    // Check if we've already replied to this post for this hashtag
    if (this.hasRecentReply(postUri, hashtag)) {
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
      this.recordReply(postUri, hashtag);
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

    const replyPost: any = {
      text: response,
      reply: {
        root: {
          uri: originalPost.uri,
          cid: originalPost.cid
        },
        parent: {
          uri: originalPost.uri,
          cid: originalPost.cid
        }
      }
    };

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

    await this.agent.post(replyPost);
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

  private hasRecentReply(postUri: string, hashtag: string): boolean {
    return this.replyHistory.some(record => 
      record.postUri === postUri && 
      record.hashtag === hashtag
    );
  }

  private isInCooldown(hashtag: string): boolean {
    const cooldownMs = getCooldownMinutes(hashtag, this.config.defaultCooldownMinutes) * 60 * 1000;
    const cutoff = Date.now() - cooldownMs;
    
    return this.replyHistory.some(record => 
      record.hashtag === hashtag && 
      record.timestamp > cutoff
    );
  }

  private recordReply(postUri: string, hashtag: string): void {
    this.replyHistory.push({
      postUri,
      hashtag,
      timestamp: Date.now()
    });
  }

  private cleanupOldReplies(): void {
    // Remove replies older than 24 hours
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const initialLength = this.replyHistory.length;
    
    this.replyHistory = this.replyHistory.filter(record => record.timestamp > oneDayAgo);
    
    const removed = initialLength - this.replyHistory.length;
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} old reply records`);
    }
  }
}
