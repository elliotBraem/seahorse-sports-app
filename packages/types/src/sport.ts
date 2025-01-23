export interface Sport {
  id: number;
  name: string;
  description: string | null;
  abbreviation: string | null;
  externalId: string | null;
  apiMetadata: Record<string, unknown>;
  createdAt: string;
}

export interface SportResponse extends Sport {
  teamCount: number;
  fanCount: number;
}
