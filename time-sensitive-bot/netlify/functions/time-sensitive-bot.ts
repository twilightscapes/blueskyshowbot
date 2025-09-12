import { Handler } from '@netlify/functions';
import { BlueskyHashtagBot } from '../../src/bot';

export const handler: Handler = async (event, context) => {
  console.log('🚀 Time-Sensitive BlueSky Show Bot triggered at:', new Date().toISOString());
  
  // Check required environment variables
  const username = process.env.BLUESKY_USERNAME || process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_PASSWORD;
  const hashtags = process.env.HASHTAGS || '#theblueskyshow';
  
  if (!username || !password) {
    console.error('❌ Missing required environment variables: BLUESKY_USERNAME and BLUESKY_PASSWORD');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing required environment variables'
      })
    };
  }

  try {
    const bot = new BlueskyHashtagBot({
      handle: username,
      password: password,
      hashtags: hashtags.split(',').map(h => h.trim()),
      responses: [], // Using responses from responses.ts
      defaultCooldownMinutes: 30,
      maxPostAgeHours: 2 // Only look at posts from last 2 hours for more frequent responses
    });

    await bot.start();
    
    console.log('✅ Time-Sensitive BlueSky Show Bot completed successfully');
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Time-Sensitive BlueSky Show Bot executed successfully',
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('❌ Time-Sensitive BlueSky Show Bot error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Bot execution failed',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      })
    };
  }
};