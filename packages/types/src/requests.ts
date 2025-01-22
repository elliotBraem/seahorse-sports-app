export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string | null;
  profileData?: Record<string, unknown>;
}

export interface AddFavoriteTeamRequest {
  teamId: number;
}

export interface CreatePredictionRequest {
  gameId: number;
  predictedWinnerId: number;
}

export interface AddSocialAccountRequest {
  platform: string;
  platformUserId: string;
  username?: string;
}

export interface CreateGameRequest {
  campaignId: number;
  sportId: number;
  homeTeamId: number;
  awayTeamId: number;
  startTime: string;
  endTime?: string;
  gameType?: string;
  pointsValue: number;
  status?: 'upcoming' | 'active' | 'completed';
  externalId?: string;
  apiMetadata?: Record<string, unknown>;
}

export interface UpdateGameRequest {
  campaignId?: number;
  sportId?: number;
  homeTeamId?: number;
  awayTeamId?: number;
  startTime?: string;
  endTime?: string;
  winnerTeamId?: number;
  gameType?: string;
  pointsValue?: number;
  status?: 'upcoming' | 'active' | 'completed';
  externalId?: string;
  apiMetadata?: Record<string, unknown>;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: 'upcoming' | 'active' | 'completed';
  rules?: Record<string, unknown>;
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: 'upcoming' | 'active' | 'completed';
  rules?: Record<string, unknown>;
}

export interface CreateQuestRequest {
  campaignId: number;
  name: string;
  description?: string;
  pointsValue: number;
  verificationType: string;
  verificationData?: Record<string, unknown>;
  startDate: string;
  endDate: string;
}

export interface UpdateQuestRequest {
  name?: string;
  description?: string;
  pointsValue?: number;
  verificationType?: string;
  verificationData?: Record<string, unknown>;
  startDate?: string;
  endDate?: string;
}

export interface CompleteQuestRequest {
  verificationProof?: Record<string, unknown>;
}
