export interface ResponseWithImage {
  text: string;
  image?: string; // Path to image file or base64 data
  alt?: string;   // Alt text for the image
}

export interface HashtagResponse {
  hashtag: string;
  responses: ResponseWithImage[];
  cooldownMinutes?: number;
  useRandomResponse?: boolean; // If false, always use first response
  includeLink?: boolean;       // Whether to include the website link
  websiteUrl?: string;         // The website URL to include
}

export interface BotConfig {
  handle: string;
  password: string;
  hashtags: string[];
  responses: HashtagResponse[];
  defaultCooldownMinutes: number;
  maxPostAgeHours?: number; // Only process posts from the last X hours (default: 24)
}

export interface LinkCardData {
  uri: string;
  title?: string;
  description?: string;
  thumb?: Uint8Array;
}
