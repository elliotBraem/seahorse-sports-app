import {
  type ProfileResponse,
  type PredictionResponse,
  type SocialAccountResponse,
  type UpdateProfileRequest,
  type AddFavoriteTeamRequest,
  type CreatePredictionRequest,
  type AddSocialAccountRequest,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function getUserProfile(
  options?: ApiOptions,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch user profile");
  }
}

export async function updateUserProfile(
  data: UpdateProfileRequest,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to update user profile");
  }
}

export async function addFavoriteTeam(
  data: AddFavoriteTeamRequest,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/favorites/teams`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to add favorite team");
  }
}

export async function removeFavoriteTeam(
  teamId: number,
  options?: ApiOptions,
): Promise<ProfileResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user/favorites/teams/${teamId}`,
      {
        method: "DELETE",
        credentials: "include",
        signal: options?.signal,
      },
    );
    return handleApiResponse<ProfileResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to remove favorite team");
  }
}

export async function createPrediction(
  data: CreatePredictionRequest,
  options?: ApiOptions,
): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<PredictionResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to create prediction");
  }
}

export async function getUserPredictions(
  options?: ApiOptions,
): Promise<PredictionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions/mine`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<PredictionResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch user predictions");
  }
}

export async function getGamePrediction(
  gameId: number,
  options?: ApiOptions,
): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predictions/${gameId}`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<PredictionResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch game prediction");
  }
}

export async function addSocialAccount(
  data: AddSocialAccountRequest,
  options?: ApiOptions,
): Promise<SocialAccountResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/social`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<SocialAccountResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to add social account");
  }
}

export async function removeSocialAccount(
  platform: string,
  options?: ApiOptions,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/social/${platform}`, {
      method: "DELETE",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<void>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to remove social account");
  }
}

export async function getSocialAccounts(
  options?: ApiOptions,
): Promise<SocialAccountResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/user/social`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<SocialAccountResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch social accounts");
  }
}
