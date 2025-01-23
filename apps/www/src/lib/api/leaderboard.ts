import {
  type AllTimeLeaderboardResponse,
  type CampaignLeaderboardResponse,
} from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function getAllTimeLeaderboard(
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<AllTimeLeaderboardResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiRequest(`/leaderboard/all-time?${params}`, { options, requiresAuth: false });
}

export async function getCampaignLeaderboard(
  campaignId: number,
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions,
): Promise<CampaignLeaderboardResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return apiRequest(`/leaderboard/${campaignId}?${params}`, { options, requiresAuth: false });
}
