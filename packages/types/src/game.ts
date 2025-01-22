export type GameStatus = 'upcoming' | 'active' | 'completed';

export interface Game {
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
}

export interface UserPrediction {
  id: number;
  userId: string;
  gameId: number;
  predictedWinnerId: number;
  pointsEarned: number | null;
  createdAt: string;
}
