export interface User {
  id: string; // EVM wallet address
  username: string;
  email: string;
  avatar: string | null;
  profileData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserFavoriteTeam {
  id: number;
  userId: string;
  teamId: number;
  createdAt: string;
}

export interface UserFavoriteSport {
  id: number;
  userId: string;
  sportId: number;
  createdAt: string;
}

export interface UserSocialAccount {
  id: number;
  userId: string;
  platform: string;
  platformUserId: string;
  username: string | null;
  verified: boolean;
  createdAt: string;
}

export interface UserPoints {
  id: number;
  userId: string;
  campaignId: number;
  totalPoints: number;
  predictionPoints: number;
  questPoints: number;
  lastUpdated: string;
}

export interface UserQuestCompletion {
  id: number;
  userId: string;
  questId: number;
  pointsEarned: number;
  completedAt: string;
  verificationProof: Record<string, unknown>;
}
