import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  console.log('🚀 Test function triggered at:', new Date().toISOString());
  
  // Check environment variables
  const hasUsername = !!process.env.BLUESKY_USERNAME;
  const hasPassword = !!process.env.BLUESKY_PASSWORD;
  
  console.log('Environment check:', { hasUsername, hasPassword });
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: 'Test function working',
      environmentCheck: {
        hasUsername,
        hasPassword,
        nodeVersion: process.version
      },
      timestamp: new Date().toISOString()
    })
  };
};
