import { Handler } from '@netlify/functions';
import { BlueskyHashtagBot } from '../src/bot';
import { BotConfig } from '../src/types';

const handler: Handler = async (event, context) => {
  console.log('🚀 Netlify function started');
  
  try {
    // Get environment variables
    const handle = process.env.BLUESKY_HANDLE;
    const password = process.env.BLUESKY_PASSWORD;
    const hashtagsEnv = process.env.HASHTAGS || '#blueskyshow';
    
    if (!handle || !password) {
      throw new Error('BLUESKY_HANDLE and BLUESKY_PASSWORD environment variables are required');
    }

    const hashtags = hashtagsEnv.split(',').map((tag: string) => tag.trim());
    
    const config: BotConfig = {
      handle,
      password,
      hashtags,
      responses: [], // Responses are handled in responses.ts
      defaultCooldownMinutes: parseInt(process.env.REPLY_INTERVAL_MINUTES || '30', 10)
    };

    console.log(`👤 Handle: ${config.handle}`);
    console.log(`🏷️  Monitoring hashtags: ${config.hashtags.join(', ')}`);
    console.log(`⏱️  Default cooldown: ${config.defaultCooldownMinutes} minutes`);

    const bot = new BlueskyHashtagBot(config);
    await bot.start();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Bot execution completed successfully',
        hashtags: config.hashtags,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Bot execution failed:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};

export { handler };
