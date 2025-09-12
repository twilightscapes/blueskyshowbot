import { HashtagResponse, ResponseWithImage } from './types';

// 🎛️ ================== MODE SWITCH ==================
// Set USE_TIME_SENSITIVE_MODE to:
//   • true  = Time-sensitive responses (5 responses based on day/time)
//   • false = Random responses (6 different responses chosen randomly)
// ====================================================
export const USE_TIME_SENSITIVE_MODE = true;

// Helper function to get the appropriate response based on current time
function getTimeBasedResponse(hashtag: string): ResponseWithImage | null {
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  if (!config || config.responses.length === 0) {
    return {
      text: `Thanks for using ${hashtag}! Join us for the BlueSky Show every Friday at 3:30 PM Central!`,
      alt: "Default BlueSky Show response"
    };
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  // Convert current time to Central Time (approximation - you may want to use a proper timezone library)
  // This is a simple approach assuming the server runs in a reasonable timezone
  const centralHour = currentHour; // Adjust this based on your server's timezone if needed
  
  // Time periods:
  // 0: More than 1 day out (Monday-Wednesday)
  // 1: Day before (Thursday)  
  // 2: Day of event - before show (Friday before 3:15 PM)
  // 3: Show is live (Friday 3:15 PM - 6:00 PM)
  // 4: Show replay period (Friday after 6:30 PM through Sunday)

  if (currentDay === 5) { // Friday
    if (centralHour < 15 || (centralHour === 15 && currentMinutes < 15)) {
      // Friday before 3:15 PM - day of event
      return config.timeSensitiveResponses?.[2] || config.responses[2];
    } else if (centralHour < 18 || (centralHour === 18 && currentMinutes === 0)) {
      // Friday 3:15 PM - 6:00 PM - show is live
      return config.timeSensitiveResponses?.[3] || config.responses[3];
    } else if (centralHour >= 18 && currentMinutes >= 30) {
      // Friday after 6:30 PM - show replay period
      return config.timeSensitiveResponses?.[4] || config.responses[4];
    } else {
      // Friday 6:00-6:30 PM - transition period, use live show response
      return config.timeSensitiveResponses?.[3] || config.responses[3];
    }
  } else if (currentDay === 6 || currentDay === 0) { // Saturday or Sunday
    // Weekend - show replay period
    return config.timeSensitiveResponses?.[4] || config.responses[4];
  } else if (currentDay === 4) { // Thursday
    // Day before
    return config.timeSensitiveResponses?.[1] || config.responses[1];
  } else { // Monday (1), Tuesday (2), Wednesday (3)
    // More than 1 day out
    return config.timeSensitiveResponses?.[0] || config.responses[0];
  }
}

export const HASHTAG_RESPONSES: HashtagResponse[] = [
  {
    hashtag: '#theblueskyshow',
    responses: [
      {
        text: "🦋 Join us for the BlueSky Show - every Friday at 3:30 PM Central! Chat with your favorite blue skyers and discuss the day's events, politics, and more! 🌟",
        image: "bluesky-show-1.webp",
        alt: "The BlueSky Show - Friday 3:30 PM Central"
      },
      {
        text: "📺 Don't miss the BlueSky Show this Friday at 3:30 PM Central! Connect with fellow blue skyers and dive into today's hot topics and political discussions! 🗳️",
        image: "bluesky-show2.webp", 
        alt: "BlueSky Show - Weekly discussions"
      },
      {
        text: "🦋 The BlueSky Show is live every Friday at 3:30 PM Central! Come hang out, chat with amazing blue skyers, and talk about everything from daily news to politics! 💬",
        image: "bluesky-show3.webp",
        alt: "Live BlueSky Show discussions"
      },
      {
        text: "✨ Friday at 3:30 PM Central means BlueSky Show time! Join the conversation with your favorite blue skyers - we cover daily events, politics, and so much more! 🎯",
        image: "bluesky-show-1.webp", // Reusing first image
        alt: "BlueSky Show conversation time"
      },
      {
        text: "🌟 Ready for the BlueSky Show? Every Friday 3:30 PM Central! Chat with fellow blue skyers about the day's events, political happenings, and everything in between! 🚀",
        image: "bluesky-show2.webp", // Reusing second image
        alt: "Get ready for the BlueSky Show"
      },
      {
        text: "🦋 BlueSky Show alert! Fridays at 3:30 PM Central - your weekly dose of great conversations with blue skyers about current events, politics, and more! 📡",
        image: "bluesky-show3.webp", // Reusing third image
        alt: "BlueSky Show weekly alert"
      }
    ],
    timeSensitiveResponses: [
      {
        // 0: More than 1 day out (Monday - Wednesday)
        text: "🦋 Join us for the BlueSky Show - every Friday at 3:30 PM Central! Chat with your favorite blue skyers and discuss the day's events, politics, and more! 🌟",
        image: "blueskyshow-week.webp",
        alt: "The BlueSky Show - Friday 3:30 PM Central"
      },
      {
        // 1: Day before (Thursday)
        text: "📺 Tomorrow is BlueSky Show day! Don't miss it - Friday at 3:30 PM Central! Connect with fellow blue skyers and dive into today's hot topics and political discussions! 🗳️",
        image: "blueskyshow-tomorrow.webp", 
        alt: "BlueSky Show tomorrow - Friday 3:30 PM Central"
      },
      {
        // 2: Day of event - before show (Friday before 3:15 PM)
        text: "🎉 TODAY is BlueSky Show day! Join us at 3:30 PM Central! Come hang out, chat with amazing blue skyers, and talk about everything from daily news to politics! 💬✨",
        image: "blueskyshow-today.webp",
        alt: "BlueSky Show TODAY at 3:30 PM Central"
      },
      {
        // 3: Show is live (Friday 3:15 PM - 6:00 PM)
        text: "🔴 LIVE NOW! The BlueSky Show is happening RIGHT NOW! Join us live at the link below for amazing conversations with blue skyers about today's hottest topics! 🎙️🔥",
        image: "blueskyshow-live.webp",
        alt: "BlueSky Show LIVE NOW"
      },
      {
        // 4: Show replay period (Friday after 6:30 PM through Sunday)
        text: "🎬 Missed the BlueSky Show? No worries! Catch the replay and join the ongoing conversation with fellow blue skyers about this week's discussions! 📺💬",
        image: "blueskyshow-replays.webp",
        alt: "BlueSky Show replay available"
      }
    ],
    cooldownMinutes: 30,
    useRandomResponse: true,        // Set to false to always use first response
    includeLink: true,              // Whether to add website link
    websiteUrl: "https://www.clubhouse.com/house/bluesky-show?chs=RXrTq17X7E%3Aw3ez74oiMoA-UJbfZCkNWIId2XxnMboDLLPn3cOYPnc&utm_medium=ch_house_settings"
  }
];

export function getRandomResponse(hashtag: string): ResponseWithImage | null {
  // 🎛️ Check if we should use time-sensitive mode
  if (USE_TIME_SENSITIVE_MODE) {
    return getTimeBasedResponse(hashtag);
  }

  // Default random/fixed response mode
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  if (!config || config.responses.length === 0) {
    return {
      text: `Thanks for using ${hashtag}! Join us for the BlueSky Show every Friday at 3:30 PM Central!`,
      alt: "Default BlueSky Show response"
    };
  }
  
  let selectedResponse: ResponseWithImage;
  
  if (config.useRandomResponse === false) {
    // Always use first response
    selectedResponse = config.responses[0];
  } else {
    // Use random response (default behavior)
    const randomIndex = Math.floor(Math.random() * config.responses.length);
    selectedResponse = config.responses[randomIndex];
  }
  
  // Add website link if configured and NOT using embed (since embed will include the link)
  let finalText = selectedResponse.text;
  // Don't add URL to text when using images since it will be in the link card embed
  
  return {
    ...selectedResponse,
    text: finalText
  };
}

export function getCooldownMinutes(hashtag: string, defaultCooldown: number = 30): number {
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  return config?.cooldownMinutes ?? defaultCooldown;
}
