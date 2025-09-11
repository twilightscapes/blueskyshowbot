# Cost Analysis - Netlify Functions Usage

## 💰 Free Tier Limits
- **Netlify Free**: 300 credits/month
- **Compute**: 5 credits per GB-hour
- **Requests**: 3 credits per 10,000 requests

## 📊 Usage Scenarios

### Every 1 Minute
- **Invocations**: 43,800/month
- **Estimated Credits**: ~28/month
- **Percentage of Free Tier**: 9.3%
- **✅ Status**: Well within limits

### Every 2 Minutes (Current)  
- **Invocations**: 21,900/month
- **Estimated Credits**: ~14/month
- **Percentage of Free Tier**: 4.7%
- **✅ Status**: Very safe

### Every 5 Minutes (Recommended)
- **Invocations**: 8,760/month
- **Estimated Credits**: ~6/month
- **Percentage of Free Tier**: 2%
- **✅ Status**: Extremely efficient

### Every 10 Minutes
- **Invocations**: 4,380/month
- **Estimated Credits**: ~3/month
- **Percentage of Free Tier**: 1%
- **✅ Status**: Maximum efficiency

## 🎯 Recommendations

### For Maximum Responsiveness: **1-2 Minutes**
- Perfect for active show promotion periods
- Near real-time engagement
- Still uses <10% of free tier

### For Balanced Performance: **3-5 Minutes** ⭐ **RECOMMENDED**
- Great response time for social media
- Very efficient resource usage
- Uses <3% of free tier

### For Maximum Efficiency: **10+ Minutes**
- Good for overnight/off-hours
- Ultra-low resource usage
- Uses <2% of free tier

## 🔧 Dynamic Scheduling (Advanced)

Consider different frequencies for different times:
- **Show Days (Friday)**: Every 1-2 minutes
- **Active Hours (9 AM - 9 PM)**: Every 5 minutes  
- **Off Hours**: Every 15-30 minutes

## 💡 Bottom Line

**You can safely run every 1 minute** and still use less than 10% of your free tier!

The 24-hour post filtering we added ensures your function stays fast and efficient regardless of frequency.
