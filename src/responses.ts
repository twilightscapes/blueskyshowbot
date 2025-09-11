import { HashtagResponse } from './types';

export const HASHTAG_RESPONSES: HashtagResponse[] = [
  {
    hashtag: '#theblueskyshow',
    responses: [
      '🦋 Join us for the BlueSky Show - every Friday at 3:30 PM Central! Chat with your favorite blue skyers and discuss the day\'s events, politics, and more! 🌟',
      '📺 Don\'t miss the BlueSky Show this Friday at 3:30 PM Central! Connect with fellow blue skyers and dive into today\'s hot topics and political discussions! 🗳️',
      '🦋 The BlueSky Show is live every Friday at 3:30 PM Central! Come hang out, chat with amazing blue skyers, and talk about everything from daily news to politics! 💬',
      '✨ Friday at 3:30 PM Central means BlueSky Show time! Join the conversation with your favorite blue skyers - we cover daily events, politics, and so much more! 🎯',
      '🌟 Ready for the BlueSky Show? Every Friday 3:30 PM Central! Chat with fellow blue skyers about the day\'s events, political happenings, and everything in between! 🚀',
      '🦋 BlueSky Show alert! Fridays at 3:30 PM Central - your weekly dose of great conversations with blue skyers about current events, politics, and more! 📡'
    ],
    cooldownMinutes: 30,
    links: [
      'https://blueskyshow.com',
    //   'https://blueskyshow.com/watch',
    //   'https://blueskyshow.com/schedule'
    ]
  }
];

export function getRandomResponse(hashtag: string): string {
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  if (!config || config.responses.length === 0) {
    return `Thanks for using ${hashtag}! Join us for the BlueSky Show every Friday at 3:30 PM Central!`;
  }
  
  const randomIndex = Math.floor(Math.random() * config.responses.length);
  return config.responses[randomIndex];
}

export function getCooldownMinutes(hashtag: string, defaultCooldown: number = 30): number {
  const config = HASHTAG_RESPONSES.find(r => r.hashtag.toLowerCase() === hashtag.toLowerCase());
  return config?.cooldownMinutes ?? defaultCooldown;
}
