import dotenv from 'dotenv';
import { BlueskyHashtagBot } from './bot';
import { BotConfig } from './types';

// Load environment variables
dotenv.config();

function createBotConfig(): BotConfig {
  const handle = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_PASSWORD;
  const hashtagsEnv = process.env.HASHTAGS || '#theblueskyshow';
  
  if (!handle || !password) {
    throw new Error('BLUESKY_HANDLE and BLUESKY_PASSWORD environment variables are required');
  }

  const hashtags = hashtagsEnv.split(',').map(tag => tag.trim());
  
  return {
    handle,
    password,
    hashtags,
    responses: [], // Responses are handled in responses.ts
    defaultCooldownMinutes: parseInt(process.env.REPLY_INTERVAL_MINUTES || '30', 10)
  };
}

async function main() {
  try {
    // Check if bot is disabled
    if (process.env.BOT_DISABLED === 'true') {
      console.log('🛑 Bot is disabled via BOT_DISABLED environment variable');
      return;
    }

    const config = createBotConfig();
    const bot = new BlueskyHashtagBot(config);
    
    console.log('🚀 Starting Bluesky Hashtag Bot...');
    console.log(`👤 Handle: ${config.handle}`);
    console.log(`🏷️  Monitoring hashtags: ${config.hashtags.join(', ')}`);
    console.log(`⏱️  Default cooldown: ${config.defaultCooldownMinutes} minutes`);
    
    await bot.start();
  } catch (error) {
    console.error('❌ Bot failed to start:', error);
    process.exit(1);
  }
}

// Run the bot
if (require.main === module) {
  main();
}
