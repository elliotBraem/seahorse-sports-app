import {
  type CampaignResponse,
  type CreateCampaignRequest,
  type UpdateCampaignRequest,
  type CampaignLeaderboardResponse,
} from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function listCampaigns(
  options?: ApiOptions,
): Promise<CampaignResponse[]> {
  return apiRequest("/campaigns", { options, requiresAuth: false });
}

export async function getCampaign(
  campaignId: number,
  options?: ApiOptions,
): Promise<CampaignResponse> {
  return apiRequest(`/campaigns/${campaignId}`, {
    options,
    requiresAuth: false,
  });
}

export async function getCampaignLeaderboardDetailed(
  campaignId: number,
  options?: ApiOptions,
): Promise<CampaignLeaderboardResponse> {
  return apiRequest(`/campaigns/${campaignId}/leaderboard`, {
    options,
    requiresAuth: false,
  });
}

// Admin endpoints

export async function createCampaign(
  data: CreateCampaignRequest,
  options?: ApiOptions,
): Promise<CampaignResponse> {
  return apiRequest("/admin/campaigns", {
    method: "POST",
    body: data,
    options,
  });
}

export async function updateCampaign(
  campaignId: number,
  data: UpdateCampaignRequest,
  options?: ApiOptions,
): Promise<CampaignResponse> {
  return apiRequest(`/admin/campaigns/${campaignId}`, {
    method: "PATCH",
    body: data,
    options,
  });
}

export async function deleteCampaign(
  campaignId: number,
  options?: ApiOptions,
): Promise<void> {
  return apiRequest(`/admin/campaigns/${campaignId}`, {
    method: "DELETE",
    options,
  });
}
