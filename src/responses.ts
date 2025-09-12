import { HashtagResponse, ResponseWithImage } from './types';

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
    cooldownMinutes: 30,
    useRandomResponse: true,        // Set to false to always use first response
    includeLink: true,              // Whether to add website link
    websiteUrl: "https://blueskyshow.com"
  }
];

export function getRandomResponse(hashtag: string): ResponseWithImage | null {
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
