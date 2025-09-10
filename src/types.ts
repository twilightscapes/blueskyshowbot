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
}

export interface LinkCardData {
  uri: string;
  title?: string;
  description?: string;
  thumb?: Uint8Array;
}
