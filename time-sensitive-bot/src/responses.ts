import { HashtagResponse, ResponseWithImage } from './types';

// Helper function to get the appropriate response based on current time
export function getTimeBasedResponse(hashtag: string): ResponseWithImage | null {
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  if (!config || config.responses.length === 0) {
    return {
      text: `Thanks for using ${hashtag}! Join us for the BlueSky Show every Friday at 3:00 PM Central!`,
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
  
  // Calculate time until next Friday 3 PM Central
  let daysUntilFriday: number;
  if (currentDay === 5) { // Friday
    if (centralHour < 15 || (centralHour === 15 && currentMinutes < 0)) {
      // It's Friday but before 3 PM - day of event
      return config.responses[2]; // Day of event response
    } else {
      // It's Friday after 3 PM - more than 1 day out (next Friday)
      daysUntilFriday = 7;
    }
  } else if (currentDay === 6) { // Saturday
    daysUntilFriday = 6;
  } else if (currentDay === 0) { // Sunday
    daysUntilFriday = 5;
  } else if (currentDay === 1) { // Monday
    daysUntilFriday = 4;
  } else if (currentDay === 2) { // Tuesday
    daysUntilFriday = 3;
  } else if (currentDay === 3) { // Wednesday
    daysUntilFriday = 2;
  } else { // Thursday
    daysUntilFriday = 1;
  }

  if (daysUntilFriday === 1) {
    // Day before (Thursday)
    return config.responses[1];
  } else if (daysUntilFriday === 0) {
    // Day of event (Friday before 3 PM)
    return config.responses[2];
  } else {
    // More than 1 day out
    return config.responses[0];
  }
}

export const HASHTAG_RESPONSES: HashtagResponse[] = [
  {
    hashtag: '#theblueskyshow',
    responses: [
      {
        // More than 1 day out
        text: "🦋 Join us for the BlueSky Show - every Friday at 3:00 PM Central! Chat with your favorite blue skyers and discuss the day's events, politics, and more! 🌟",
        image: "bluesky-show-1.webp",
        alt: "The BlueSky Show - Friday 3:00 PM Central"
      },
      {
        // Day before (Thursday)
        text: "📺 Tomorrow is BlueSky Show day! Don't miss it - Friday at 3:00 PM Central! Connect with fellow blue skyers and dive into today's hot topics and political discussions! 🗳️",
        image: "bluesky-show2.webp", 
        alt: "BlueSky Show tomorrow - Friday 3:00 PM Central"
      },
      {
        // Day of event (Friday)
        text: "🎉 TODAY is BlueSky Show day! Join us at 3:00 PM Central! Come hang out, chat with amazing blue skyers, and talk about everything from daily news to politics! 💬✨",
        image: "bluesky-show3.webp",
        alt: "BlueSky Show TODAY at 3:00 PM Central"
      }
    ],
    cooldownMinutes: 30,
    useRandomResponse: false,       // Always use time-based response
    includeLink: true,
    websiteUrl: "https://www.clubhouse.com/house/bluesky-show?chs=RXrTq17X7E%3Aw3ez74oiMoA-UJbfZCkNWIId2XxnMboDLLPn3cOYPnc&utm_medium=ch_house_settings"
  }
];

export function getRandomResponse(hashtag: string): ResponseWithImage | null {
  // For the time-sensitive version, always use time-based response
  return getTimeBasedResponse(hashtag);
}

export function getCooldownMinutes(hashtag: string): number {
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  return config?.cooldownMinutes || 60;
}