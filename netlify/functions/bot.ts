import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  console.log('🚀 Netlify function triggered at:', new Date().toISOString());
  
  // Check for required environment variables
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    console.error('Missing required environment variables');
    console.error('BLUESKY_USERNAME exists:', !!process.env.BLUESKY_USERNAME);
    console.error('BLUESKY_PASSWORD exists:', !!process.env.BLUESKY_PASSWORD);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        error: 'Missing required environment variables',
        hasUsername: !!process.env.BLUESKY_USERNAME,
        hasPassword: !!process.env.BLUESKY_PASSWORD
      })
    };
  }

  try {
    console.log('Starting bot run...');
    
    // Import the bot dynamically to catch import errors
    const { runBot } = await import('../../src/bot');
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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        timestamp: new Date().toISOString()
      })
    };
  }
};

export { handler };
