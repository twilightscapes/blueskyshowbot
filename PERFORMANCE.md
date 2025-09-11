# Performance Optimization - Time-Based Post Filtering

## Problem Solved

As #theblueskyshow grows in popularity, the bot would increasingly have to process more and more historical posts, making it slower and less efficient over time.

## Solution

Added **time-based filtering** to only process recent posts:

### ✅ What's Changed

1. **24-Hour Default Filter**: Bot now only processes posts from the last 24 hours
2. **Configurable Time Window**: Can be adjusted via environment variable
3. **Efficient Processing**: Filters out old posts before processing them
4. **Clear Logging**: Shows how many posts are filtered by age

### 🔧 Configuration

**Environment Variable**: `MAX_POST_AGE_HOURS` (optional, defaults to 24)

- Set to `1` for last hour only
- Set to `6` for last 6 hours  
- Set to `48` for last 48 hours
- Leave unset for default 24 hours

### 📊 Performance Benefits

- **Faster Processing**: Fewer posts to check means faster execution
- **Lower Resource Usage**: Less memory and CPU usage as hashtag grows
- **Scalable**: Performance stays consistent regardless of hashtag popularity
- **Focused**: Only engages with fresh, recent conversations

### 🎯 Why 24 Hours?

- Captures posts from users in all time zones
- Balances freshness with comprehensive coverage
- Most social media engagement happens within 24 hours
- Perfect for daily show promotion cycle

### Example Logs

```
🔍 Searching for hashtag: #theblueskyshow
Found 25 posts for #theblueskyshow
⏰ Skipping old post from 2024-09-09T10:30:00.000Z (older than 24 hours)
⏰ Skipping old post from 2024-09-08T15:45:00.000Z (older than 24 hours)
📅 12 posts are from the last 24 hours
```

This ensures your bot stays fast and efficient as The BlueSky Show grows in popularity! 🚀
