# Time-Sensitive BlueSky Show Bot

This is a time-sensitive version of the BlueSky Show bot that changes its response based on how close it is to Friday 3:00 PM Central Time.

## Response Logic

The bot has 3 different responses:

1. **More than 1 day out** (Saturday - Wednesday): General invitation message
2. **Day before** (Thursday): "Tomorrow is BlueSky Show day!" message  
3. **Day of event** (Friday before 3:00 PM): "TODAY is BlueSky Show day!" message

## Time Calculation

- **Friday before 3:00 PM Central**: Uses "day of event" response
- **Thursday (any time)**: Uses "day before" response  
- **Saturday through Wednesday**: Uses "more than 1 day out" response
- **Friday after 3:00 PM Central**: Treats as "more than 1 day out" (for next week's show)

## Deployment

This version is designed to be deployed as a separate Netlify function at:
`/.netlify/functions/time-sensitive-bot`

## Configuration

Uses the same environment variables as the main bot:
- `BLUESKY_USERNAME` or `BLUESKY_HANDLE`
- `BLUESKY_PASSWORD` 
- `HASHTAGS` (defaults to `#theblueskyshow`)

## Cron Schedule

For optimal time-sensitive responses, consider running this more frequently on show days:
- Every 2 hours on regular days
- Every 30 minutes on Thursday and Friday