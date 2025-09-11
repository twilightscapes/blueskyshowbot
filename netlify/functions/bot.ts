import { Handler } from '@netlify/functions';
import { runBot } from '../../src/bot';

const handler: Handler = async (event, context) => {
  console.log('🚀 Netlify function triggered at:', new Date().toISOString());
  
  // Check for required environment variables
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    console.error('Missing required environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: 'Missing required environment variables' 
      })
    };
  }

  try {
    console.log('Starting bot run...');
    await runBot();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Bot execution completed successfully',
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
