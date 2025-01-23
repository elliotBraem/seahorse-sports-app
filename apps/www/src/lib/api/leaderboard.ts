import {
  type AllTimeLeaderboardResponse,
  type CampaignLeaderboardResponse,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function getAllTimeLeaderboard(
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<AllTimeLeaderboardResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/leaderboard/all-time?${params}`,
      {
        method: "GET",
        credentials: "include",
        signal: options?.signal,
      },
    );
    return handleApiResponse<AllTimeLeaderboardResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch leaderboard");
  }
}

export async function getCampaignLeaderboard(
  campaignId: number,
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<CampaignLeaderboardResponse> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/leaderboard/${campaignId}?${params}`,
      {
        method: "GET",
        credentials: "include",
        signal: options?.signal,
      },
    );
    return handleApiResponse<CampaignLeaderboardResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch campaign leaderboard");
  }
}
