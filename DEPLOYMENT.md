# Deployment Guide - External Cron + Netlify Functions

This guide will help you set up reliable scheduling using a free external cron service and Netlify Functions.

## Why This Approach?

GitHub Actions scheduled workflows can be unreliable on newer repositories. Using an external cron service to trigger a Netlify Function provides better reliability.

## Step 1: Deploy to Netlify

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Netlify function for external cron"
   git push
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub account and select this repository
   - Netlify will automatically detect the `netlify.toml` configuration

3. **Set Environment Variables in Netlify**:
   - Go to your site dashboard
   - Navigate to "Site settings" > "Environment variables"
   - Add these variables:
     - `BLUESKY_USERNAME`: Your Bluesky handle (e.g., `yourbot.bsky.social`)
     - `BLUESKY_PASSWORD`: Your Bluesky app password

4. **Deploy**: 
   - Netlify will automatically build and deploy your site
   - Note your function URL: `https://your-site-name.netlify.app/.netlify/functions/bot`

## Step 2: Set Up External Cron Service

We'll use [cron-job.org](https://cron-job.org) - it's free and reliable.

1. **Create Account**:
   - Go to [cron-job.org](https://cron-job.org)
   - Sign up for a free account

2. **Create Cron Job**:
   - Click "Create cronjob"
   - **Title**: "BlueSky Show Bot"
   - **URL**: Your Netlify function URL (from Step 1)
   - **Schedule Options** (choose one):
     - **Most Responsive** (1-2 minutes): `*/1 * * * *` (1 min) or `*/2 * * * *` (2 min)
     - **Recommended** (3-5 minutes): `*/3 * * * *` (3 min) or `*/5 * * * *` (5 min)
     - **Efficient** (10 minutes): `*/10 * * * *` (10 min)
   - **HTTP Method**: GET
   - **Enabled**: Yes
   - Click "Create cronjob"

### 📊 Timing Recommendations
- **1-2 minutes**: Near real-time, uses ~14-28 credits/month
- **3-5 minutes**: Great balance, uses ~6-10 credits/month  
- **10+ minutes**: Very efficient, uses ~3 credits/month

## Step 3: Test the Setup

1. **Manual Test**:
   - Visit your function URL directly in a browser
   - You should see a JSON response indicating success or failure

2. **Check Netlify Logs**:
   - Go to your Netlify dashboard
   - Navigate to "Functions" tab
   - Click on the "bot" function to see execution logs

3. **Monitor Cron Job**:
   - In cron-job.org, click on your job to see execution history
   - Green entries indicate successful HTTP calls

## Step 4: Monitor and Adjust

- **Function Logs**: Check Netlify function logs for bot execution details
- **Bluesky Activity**: Monitor your bot's replies on Bluesky
- **Cron History**: Use cron-job.org's history to ensure regular execution

## Troubleshooting

- **Function Errors**: Check Netlify function logs for detailed error messages
- **Authentication Issues**: Verify your Bluesky credentials in Netlify environment variables
- **Cron Not Running**: Check cron-job.org status and job configuration

## Benefits of This Setup

- ✅ **Reliable**: External cron services are designed for this purpose
- ✅ **Free**: Both Netlify Functions and cron-job.org have generous free tiers
- ✅ **Simple**: No complex GitHub Actions debugging needed
- ✅ **Monitoring**: Both services provide execution logs and status
- ✅ **Scalable**: Easy to adjust frequency or add more jobs

Your bot will now run every 2 minutes, checking for new posts with #theblueskyshow and replying with promotional content for The BlueSky Show!
