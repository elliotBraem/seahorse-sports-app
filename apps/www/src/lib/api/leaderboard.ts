import {
  type AllTimeLeaderboardResponse,
  type CampaignLeaderboardResponse,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiResponse,
  type ApiOptions,
  handleApiResponse,
} from "./types";

export async function getAllTimeLeaderboard(
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<ApiResponse<AllTimeLeaderboardResponse>> {
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
}

export async function getCampaignLeaderboard(
  campaignId: number,
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<ApiResponse<CampaignLeaderboardResponse>> {
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
}
