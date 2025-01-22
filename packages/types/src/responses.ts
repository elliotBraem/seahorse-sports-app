import { User } from "./user";
import { GameStatus, UserPrediction } from "./game";

export interface ProfileResponse extends User {
  favoriteTeams: number[];
  favoriteSports: number[];
}

export interface PredictionResponse extends UserPrediction {
  gameStartTime: string;
  gameStatus: GameStatus;
  pointsValue: number;
  homeTeamName: string;
  awayTeamName: string;
  predictedWinnerName: string;
}

export interface SocialAccountResponse {
  platform: string;
  platformUserId: string;
  username: string | null;
  verified: boolean;
  createdAt: string;
}

export interface GameResponse {
  id: number;
  campaignId: number;
  sportId: number;
  homeTeamId: number;
  awayTeamId: number;
  startTime: string;
  endTime: string | null;
  winnerTeamId: number | null;
  gameType: string | null;
  pointsValue: number;
  status: GameStatus;
  externalId: string | null;
  apiMetadata: Record<string, unknown>;
  createdAt: string;
  // Additional fields from JOINs
  homeTeamName: string;
  awayTeamName: string;
  sportName: string;
}

export interface CampaignResponse {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  rules: Record<string, unknown>;
  createdAt: string;
}

export interface LeaderboardEntryResponse {
  userId: string;
  username: string;
  avatar: string | null;
  totalPoints: number;
  predictionPoints: number;
  questPoints: number;
  rank: number;
}

export interface QuestResponse {
  id: number;
  campaignId: number;
  name: string;
  description: string | null;
  pointsValue: number;
  verificationType: string;
  verificationData: Record<string, unknown> | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  // Additional fields from JOINs
  campaignName: string;
  completionCount: number;
}

export interface QuestCompletionResponse {
  id: number;
  userId: string;
  questId: number;
  pointsEarned: number;
  completedAt: string;
  verificationProof: Record<string, unknown> | null;
  // Additional fields from JOINs
  questName: string;
  questDescription: string | null;
  verificationType: string;
  campaignName: string;
}

export interface TeamResponse {
  id: number;
  sportId: number;
  name: string;
  description: string | null;
  logo: string | null;
  externalId: string | null;
  apiMetadata: Record<string, unknown>;
  createdAt: string;
  // Additional fields from JOINs
  sportName: string;
  fanCount: number;
  socialAccounts: Record<string, string>;
}

export interface TeamFanResponse {
  id: string;
  username: string;
  avatar: string | null;
  fanSince: string;
  predictionsCount: number;
}

export interface TeamFansPageResponse {
  fans: TeamFanResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeaderboardRankingResponse {
  userId: string;
  username: string;
  avatar: string | null;
  totalPoints: number;
  predictionPoints: number;
  questPoints: number;
  rank: number;
  lastUpdated: string;
}

export interface AllTimeLeaderboardResponse {
  rankings: LeaderboardRankingResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CampaignLeaderboardResponse {
  campaign: {
    id: number;
    name: string;
    status: "upcoming" | "active" | "completed";
  };
  rankings: LeaderboardRankingResponse[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
