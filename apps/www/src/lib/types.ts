export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  points: number;
  rank?: number;
  completedQuests: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  status: "locked" | "active" | "completed";
  type: "twitter" | "other";
  twitterIntent?: {
    text: string;
    hashtags: string[];
    via?: string;
  };
}
