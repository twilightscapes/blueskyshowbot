# Image Setup Guide

## Overview

The BlueSky Show Bot uses base64-encoded images embedded directly in the code for serverless deployment. This guide explains how to manage and update the promotional images.

## Current Image Configuration

The bot uses 8 different images for various scenarios:

### Random Promotional Images (3)
- `bluesky-show-1.webp` - General promotional image 1
- `bluesky-show2.webp` - General promotional image 2  
- `bluesky-show3.webp` - General promotional image 3

### Time-Sensitive Promotional Images (5)
- `blueskyshow-week.webp` - Week ahead (Monday-Wednesday)
- `blueskyshow-tomorrow.webp` - Day before (Thursday)
- `blueskyshow-today.webp` - Day of event (Friday before 3:15 PM)
- `blueskyshow-live.webp` - Show is live (Friday 3:15-6:00 PM)
- `blueskyshow-replays.webp` - Replay period (Friday after 6:30 PM - Sunday)

## Adding or Replacing Images

### Step 1: Prepare Your Images
1. **Format**: Use `.webp` format for optimal file size
2. **Size**: Recommended dimensions: 1200x630px (social media standard)
3. **File naming**: Use exact filenames listed above

### Step 2: Place Images
```bash
# Copy your new images to the assets directory
cp your-new-image.webp assets/images/blueskyshow-today.webp
```

### Step 3: Re-encode Images
**CRITICAL:** After any image changes, you must re-encode:

```bash
# Navigate to project directory
cd /path/to/blueskyshowbot

# Run the encoding script
node scripts/encode-images.js
```

This script will:
- Read all images from `assets/images/`
- Convert them to base64 strings
- Update `src/images.ts` with the encoded data
- Show confirmation for each processed image

### Step 4: Build and Deploy
```bash
# Build the project
npm run build

# Deploy to production
netlify deploy --prod
```

## How Image Encoding Works

### Why Base64 Encoding?
- **Serverless compatibility**: No file system access in Netlify Functions
- **Self-contained deployment**: All assets bundled with code
- **Fast loading**: No external image requests needed

### The Encoding Process
1. `scripts/encode-images.js` reads image files
2. Converts each to base64 string
3. Writes to `src/images.ts` as TypeScript constants
4. Bot retrieves images using `getImageBuffer()` function

### Generated Code Example
```typescript
// src/images.ts (auto-generated)
export const ENCODED_IMAGES: Record<string, string> = {
  'blueskyshow-today.webp': 'data:image/webp;base64,UklGRmQA...',
  // ... other images
};
```

## Time-Sensitive Image Logic

The bot automatically selects images based on current time:

| Time Period | Selected Image | Purpose |
|-------------|----------------|---------|
| Monday-Wednesday | `blueskyshow-week.webp` | Week ahead promotion |
| Thursday | `blueskyshow-tomorrow.webp` | Tomorrow reminder |
| Friday before 3:15 PM | `blueskyshow-today.webp` | Day of event excitement |
| Friday 3:15-6:00 PM | `blueskyshow-live.webp` | Live show promotion |
| Friday 6:30 PM - Sunday | `blueskyshow-replays.webp` | Replay availability |

## Troubleshooting

### Image Not Showing
1. **Check filename**: Must match exactly (case-sensitive)
2. **Re-encode**: Run `node scripts/encode-images.js`
3. **Rebuild**: Run `npm run build`
4. **Deploy**: Run `netlify deploy --prod`

### File Size Concerns
- Base64 encoding increases file size by ~33%
- Keep individual images under 500KB
- Use `.webp` format for best compression

### Verification
After encoding, check that your image appears in `src/images.ts`:
```bash
# Check if your image was encoded
grep "blueskyshow-today.webp" src/images.ts
```

## Testing Images

### Local Testing
```bash
# Test image retrieval
node test-image-retrieval.js
```

### Production Testing
1. Check Netlify function logs
2. Look for image upload confirmations
3. Verify correct images appear in Bluesky posts

## Best Practices

1. **Always re-encode** after image changes
2. **Test locally** before deploying
3. **Use descriptive filenames** that match the time periods
4. **Optimize images** before encoding (compress, resize)
5. **Backup originals** before replacing files

---

Remember: The encoding step is **mandatory** - the bot cannot access image files directly in the serverless environment!