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

// Re-export database types from shared package
export type {
  Campaign,
  Game,
  Team,
  User as UserProfile,
  UserPrediction as Prediction,
  Quest,
  UserQuestCompletion,
  UserPoints,
} from '@renegade-fanclub/types';
