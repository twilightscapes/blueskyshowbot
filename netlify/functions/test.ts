import { Handler } from '@netlify/functions';
import * as fs from 'fs';
import * as path from 'path';

export const handler: Handler = async (event, context) => {
  console.log('🚀 Test function triggered at:', new Date().toISOString());
  
  // Check environment variables
  const hasUsername = !!process.env.BLUESKY_USERNAME;
  const hasPassword = !!process.env.BLUESKY_PASSWORD;
  
  console.log('Environment check:', { hasUsername, hasPassword });
  
  // Check for image files
  const imageFiles = [
    'bluesky-show-1.webp', 
    'bluesky-show2.webp', 
    'bluesky-show3.webp',
    'blueskyshow-week.webp',
    'blueskyshow-tomorrow.webp', 
    'blueskyshow-today.webp',
    'blueskyshow-live.webp',
    'blueskyshow-replays.webp'
  ];
  const imagePaths = [];
  const foundImages = [];
  
  console.log(`📂 Current working directory: ${process.cwd()}`);
  console.log(`📂 __dirname: ${__dirname}`);
  
  for (const imageFile of imageFiles) {
    const possiblePaths = [
      path.join(__dirname, '..', 'assets', 'images', imageFile),
      path.join(__dirname, '..', '..', 'assets', 'images', imageFile),
      path.join(process.cwd(), 'assets', 'images', imageFile),
      path.join(process.cwd(), 'dist', 'assets', 'images', imageFile)
    ];
    
    console.log(`🔍 Searching for ${imageFile}:`);
    let found = false;
    for (const testPath of possiblePaths) {
      console.log(`  Checking: ${testPath}`);
      if (fs.existsSync(testPath)) {
        console.log(`  ✅ Found at: ${testPath}`);
        foundImages.push({ file: imageFile, path: testPath });
        found = true;
        break;
      } else {
        console.log(`  ❌ Not found`);
      }
    }
    if (!found) {
      console.log(`  ⚠️ ${imageFile} not found in any location`);
    }
  }
  
  // List what's actually in the function directory
  try {
    const funcDir = path.dirname(__dirname);
    console.log(`📁 Contents of ${funcDir}:`);
    const contents = fs.readdirSync(funcDir);
    console.log(contents);
    
    // Check if there's an assets folder
    const assetsPath = path.join(funcDir, 'assets');
    if (fs.existsSync(assetsPath)) {
      console.log(`📁 Contents of ${assetsPath}:`);
      const assetsContents = fs.readdirSync(assetsPath);
      console.log(assetsContents);
      
      const imagesPath = path.join(assetsPath, 'images');
      if (fs.existsSync(imagesPath)) {
        console.log(`📁 Contents of ${imagesPath}:`);
        const imageContents = fs.readdirSync(imagesPath);
        console.log(imageContents);
      }
    }
  } catch (dirError) {
    console.log(`📁 Error listing directories:`, dirError);
  }
  
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
      imageCheck: {
        foundImages: foundImages.length,
        details: foundImages
      },
      timestamp: new Date().toISOString()
    })
  };
};
