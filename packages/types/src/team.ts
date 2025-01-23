export interface Team {
  id: number;
  sportId: number;
  name: string;
  abbreviation: string | null;
  externalId: string | null;
  apiMetadata: Record<string, unknown>;
  createdAt: string;
}

export interface TeamSocialAccount {
  id: number;
  teamId: number;
  platform: string;
  platformUserId: string;
  username: string | null;
  verified: boolean;
  createdAt: string;
}

// View type for team fan distribution
export interface TeamFanDistribution {
  teamName: string;
  sportName: string;
  fanCount: number;
}
