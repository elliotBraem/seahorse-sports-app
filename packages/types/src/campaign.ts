export type CampaignStatus = "upcoming" | "active" | "completed";

export interface Campaign {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  rules: Record<string, unknown>;
  createdAt: string;
}

export interface Quest {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  pointsValue: number;
  verificationType: string;
  verificationData: Record<string, unknown>;
  startDate: string;
  endDate: string;
  createdAt: string;
}

// View type for campaign leaderboard
export interface CampaignLeaderboardEntry {
  username: string;
  avatar: string | null;
  campaignId: number;
  totalPoints: number;
  predictionPoints: number;
  questPoints: number;
  rank: number;
}

// View type for all-time leaderboard
export interface AllTimeLeaderboardEntry {
  username: string;
  avatar: string | null;
  totalPoints: number;
  predictionPoints: number;
  questPoints: number;
  rank: number;
}
