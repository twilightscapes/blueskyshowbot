export interface HashtagResponse {
  hashtag: string;
  responses: string[];
  cooldownMinutes?: number;
  links?: string[]; // Optional links to create link cards
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
