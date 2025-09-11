# Image Setup Guide

## Quick Start

1. **Create your 6 promotional images** for The BlueSky Show
2. **Name them exactly:**
   - `bluesky-show-1.jpg`
   - `bluesky-show-2.jpg` 
   - `bluesky-show-3.jpg`
   - `bluesky-show-4.jpg`
   - `bluesky-show-5.jpg`
   - `bluesky-show-6.jpg`

3. **Place them in:** `assets/images/` directory

4. **Configure behavior in** `src/responses.ts`:
   ```typescript
   useRandomResponse: true,    // false = always use first response
   includeLink: true,          // false = no website link
   websiteUrl: "https://blueskyshow.com"
   ```

## No Images? No Problem!

If no images are found, the bot will:
- ✅ Still post the text responses
- ✅ Include website links (if enabled)
- ✅ Log warnings about missing images
- ✅ Continue working normally

## Testing

After adding images:
1. Deploy to Netlify 
2. Check function logs to see:
   - `🔍 Looking for image at: [path]`
   - `📤 Uploading image: [filename]`
   - `✅ Image uploaded successfully`

## Flexibility Features

- **Single response mode**: Set `useRandomResponse: false`
- **Multiple responses**: Keep `useRandomResponse: true`  
- **With/without links**: Toggle `includeLink`
- **Custom website**: Change `websiteUrl`
- **Easy image updates**: Just replace files and redeploy