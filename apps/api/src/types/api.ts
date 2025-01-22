// Response Types
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Common Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Auth Types
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

// Helper function to create standardized responses
export function createSuccessResponse<T>(
  data: T,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify({ success: true, data }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      ...extraHeaders,
    },
  });
}

export function createErrorResponse(
  code: string,
  message: string,
  status: number = 400,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: { code, message },
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...extraHeaders,
      },
    },
  );
}

// Database Types based on schema
export interface Campaign {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "completed";
  rules: string;
  created_at: string;
}

export interface Game {
  id: number;
  campaign_id: number;
  sport_id: number;
  home_team_id: number;
  away_team_id: number;
  start_time: string;
  end_time: string | null;
  winner_team_id: number | null;
  game_type: string;
  points_value: number;
  status: "upcoming" | "active" | "completed";
  external_id: string | null;
  api_metadata: string;
  created_at: string;
}

export interface Team {
  id: number;
  sport_id: number;
  name: string;
  abbreviation: string | null;
  external_id: string | null;
  api_metadata: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  profile_data: string;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: number;
  user_id: string;
  game_id: number;
  predicted_winner_id: number;
  points_earned: number | null;
  created_at: string;
}

export interface Quest {
  id: number;
  campaign_id: number;
  name: string;
  description: string | null;
  points_value: number;
  verification_type: string;
  verification_data: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface UserQuestCompletion {
  id: number;
  user_id: string;
  quest_id: number;
  points_earned: number;
  completed_at: string;
  verification_proof: string | null;
}

export interface UserPoints {
  id: number;
  user_id: string;
  campaign_id: number;
  total_points: number;
  prediction_points: number;
  quest_points: number;
  last_updated: string;
}
