import {
  type TeamResponse,
  type TeamFansPageResponse,
  type AddFavoriteTeamRequest,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function listTeams(
  options?: ApiOptions,
): Promise<TeamResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "GET",
      credentials: "include",
      headers: options?.accountId ? {
        Authorization: `Bearer ${options.accountId}`
      } : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<TeamResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch teams");
  }
}

export async function addFavoriteTeam(
  data: AddFavoriteTeamRequest,
  options?: ApiOptions,
): Promise<TeamResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/favorites`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.accountId && { Authorization: `Bearer ${options.accountId}` })
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<TeamResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to add favorite team");
  }
}

export async function removeFavoriteTeam(
  teamId: number,
  options?: ApiOptions,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/favorites/${teamId}`, {
      method: "DELETE",
      credentials: "include",
      headers: options?.accountId ? {
        Authorization: `Bearer ${options.accountId}`
      } : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<void>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to remove favorite team");
  }
}

export async function getTeam(
  teamId: number,
  options?: ApiOptions,
): Promise<TeamResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: "GET",
      credentials: "include",
      headers: options?.accountId ? {
        Authorization: `Bearer ${options.accountId}`
      } : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<TeamResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch team");
  }
}

export async function getTeamFans(
  teamId: number,
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<TeamFansPageResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/teams/${teamId}/fans?${params}`,
      {
        method: "GET",
        credentials: "include",
        headers: options?.accountId ? {
          Authorization: `Bearer ${options.accountId}`
        } : undefined,
        signal: options?.signal,
      },
    );
    return handleApiResponse<TeamFansPageResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch team fans");
  }
}
