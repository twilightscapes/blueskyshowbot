# BlueSky Show Bot Images

This directory contains promotional images for the BlueSky Show bot responses.

## Image Requirements

- **Format**: JPG, PNG, GIF, or WebP
- **Size**: Recommended 1200x630px (social media standard)
- **File Size**: Under 1MB for best performance
- **Quality**: High quality but optimized for web

## Current Images

Place your promotional images here with these filenames:

- `bluesky-show-1.jpg` - Primary show promotion
- `bluesky-show-2.jpg` - Weekly discussions theme  
- `bluesky-show-3.jpg` - Live show theme
- `bluesky-show-4.jpg` - Conversation time theme
- `bluesky-show-5.jpg` - Get ready theme
- `bluesky-show-6.jpg` - Weekly alert theme

## Easy Configuration

To control how responses work, edit `src/responses.ts`:

### Use Only First Response (Same Every Time)
```typescript
useRandomResponse: false  // Always uses first response with first image
```

### Use Random Responses (Variety)
```typescript  
useRandomResponse: true   // Randomly picks from all 6 responses/images
```

### Include/Exclude Website Link
```typescript
includeLink: true         // Adds website URL to text
includeLink: false        // No website URL in text
```

## Creating Your Images

1. Create 6 promotional images for The BlueSky Show
2. Save them as JPG files in this directory
3. Use the exact filenames listed above
4. Images should promote Friday 3:30 PM Central show time

## Example Image Ideas

- Show logo with time/day info
- Host photos with show details  
- Colorful graphics with "Every Friday 3:30 PM Central"
- Community/discussion themed graphics
- Political discussion themes
- Social media call-to-action designs

The bot will automatically upload and attach the appropriate image to each response!