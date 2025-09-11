# BlueSky Show Bot 🎙️

A simple Bluesky bot that monitors the #theblueskyshow hashtag and responds with automated replies to promote the weekly BlueSky Show - every Friday at 3:30 PM Central!

## Features

- 🎯 **Case-insensitive hashtag monitoring** - Responds to #theblueskyshow, #TheBlueSkyShow, #THEBLUESKYSHOW, etc.
- 📺 **Show promotion** - Promotes the weekly BlueSky Show with details about timing and content
- 🔗 **Link cards** - Automatically creates link cards for blueskyshow.com URLs
- ⏱️ **Smart cooldowns** - Prevents spam with 30-minute cooldown periods
- 🚫 **Duplicate prevention** - Won't reply to the same post multiple times
- 📊 **Performance optimized** - Only processes posts from the last 24 hours
- ☁️ **Serverless deployment** - Runs on Netlify Functions
- 🔄 **Reliable scheduling** - External cron service for consistent execution

## About the Show

The BlueSky Show is a weekly live discussion every **Friday at 3:30 PM Central Time** where viewers can:
- 💬 Chat with their favorite blue skyers
- 🗳️ Discuss daily events and politics
- 🌟 Connect with the BlueSky community
- 📡 Engage in real-time conversations

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd bluesky-show-bot
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your details:
```bash
cp .env.example .env
```

Edit `.env`:
```env
BLUESKY_HANDLE=your-bot-handle.bsky.social
BLUESKY_PASSWORD=your-app-password
HASHTAGS=#theblueskyshow
REPLY_INTERVAL_MINUTES=30
```

### 3. Local Testing
```bash
npm run dev
```

### 4. Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

### 5. Setup GitHub Actions

Add these secrets to your GitHub repository:
- `NETLIFY_BOT_URL` - Your Netlify function URL

## Configuration

### Hashtag
The bot monitors a single hashtag: `#theblueskyshow`

### Responses
The bot has 6 different response templates in `src/responses.ts`, each promoting the Friday 3:30 PM Central show:

```typescript
responses: [
  '🎙️ Join us for the BlueSky Show - every Friday at 3:30 PM Central! Chat with your favorite blue skyers and discuss the day\'s events, politics, and more! 🌟',
  // ... more responses
]
```

### Link Cards
The bot can automatically create link cards for:
- https://blueskyshow.com
- https://blueskyshow.com/watch  
- https://blueskyshow.com/schedule

When a response is posted, the bot randomly selects one of these URLs and creates an attractive link card embed.

### Cooldowns
- **30-minute cooldown** - Prevents responding too frequently to #theblueskyshow
- **Per-post tracking** - Won't reply to the same post twice
- **Memory cleanup** - Removes tracking data older than 24 hours

## How It Works

1. **Search** - Bot searches for posts containing #theblueskyshow
2. **Filter** - Checks cooldowns and duplicate prevention
3. **Respond** - Selects a random response about the Friday show
4. **Link Card** - Creates a link card for blueskyshow.com (random URL)
5. **Track** - Records the reply to prevent duplicates
6. **Cleanup** - Removes old tracking data to manage memory

## Deployment

### Netlify Functions
The bot runs as a Netlify Function for serverless execution:
- `netlify/functions/bot.ts` - Main function endpoint
- Triggered by HTTP requests
- Handles environment variables automatically

### GitHub Actions
Automated scheduling via GitHub Actions:
- Runs every 2 minutes by default
- Can be triggered manually
- Calls the Netlify function via HTTP

## Development

### Local Development
```bash
npm run dev          # Run bot once locally
npm run build        # Compile TypeScript
npm run dev:netlify  # Test Netlify function locally
```

### File Structure
```
src/
├── bot.ts          # Main bot logic
├── types.ts        # TypeScript interfaces
├── responses.ts    # Hashtag response configuration
└── index.ts        # Local development entry point

netlify/
└── functions/
    └── bot.ts      # Netlify function wrapper

.github/
└── workflows/
    └── bot-scheduler.yml  # GitHub Actions automation
```

## Monitoring

The bot provides detailed console logging:
- 🔍 Search results for each hashtag
- ✅ Successful replies
- ⏭️ Skipped posts (duplicates/cooldowns)
- 🧹 Cleanup operations
- ❌ Error handling

## Customization

### Adding New Responses
1. Edit the `responses` array in `src/responses.ts`
2. Add new response text mentioning Friday 3:30 PM Central
3. Deploy changes

### Modifying Link Cards
Edit the `links` array in `src/responses.ts`:
```typescript
links: [
  'https://blueskyshow.com',
  'https://blueskyshow.com/watch',
  'https://blueskyshow.com/schedule'
]
```

### Changing Schedule
Edit `.github/workflows/bot-scheduler.yml`:
```yaml
schedule:
  - cron: '*/5 * * * *'  # Every 5 minutes instead of 2
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BLUESKY_HANDLE` | Your bot's Bluesky handle | Required |
| `BLUESKY_PASSWORD` | App password from Bluesky | Required |
| `HASHTAGS` | Hashtag to monitor (single) | `#theblueskyshow` |
| `REPLY_INTERVAL_MINUTES` | Cooldown between replies | `30` |

## Troubleshooting

### Common Issues

**Bot not responding:**
- Check environment variables
- Verify Bluesky credentials
- Check Netlify function logs

**Too many/few responses:**
- Adjust cooldown periods in `responses.ts`
- Modify GitHub Actions schedule
- Check hashtag spelling

**Authentication errors:**
- Generate new app password in Bluesky
- Verify handle format (`user.bsky.social`)

## License

MIT License - Feel free to modify for your own projects!

---

Built for blueskyshow.com 🎬
