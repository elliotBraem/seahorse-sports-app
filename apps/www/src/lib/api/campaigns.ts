import {
  type CampaignResponse,
  type CreateCampaignRequest,
  type UpdateCampaignRequest,
  type CampaignLeaderboardResponse,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function listCampaigns(
  options?: ApiOptions,
): Promise<CampaignResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: "GET",
      credentials: "include",
      headers: options?.accountId
        ? {
            Authorization: `Bearer ${options.accountId}`,
          }
        : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<CampaignResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to fetch campaigns");
  }
}

export async function getCampaign(
  campaignId: number,
  options?: ApiOptions,
): Promise<CampaignResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
      method: "GET",
      credentials: "include",
      headers: options?.accountId
        ? {
            Authorization: `Bearer ${options.accountId}`,
          }
        : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<CampaignResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to fetch campaign");
  }
}

export async function getCampaignLeaderboardDetailed(
  campaignId: number,
  options?: ApiOptions,
): Promise<CampaignLeaderboardResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/campaigns/${campaignId}/leaderboard`,
      {
        method: "GET",
        credentials: "include",
        headers: options?.accountId
          ? {
              Authorization: `Bearer ${options.accountId}`,
            }
          : undefined,
        signal: options?.signal,
      },
    );
    return handleApiResponse<CampaignLeaderboardResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to fetch campaign leaderboard");
  }
}

// Admin endpoints

export async function createCampaign(
  data: CreateCampaignRequest,
  options?: ApiOptions,
): Promise<CampaignResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.accountId && {
          Authorization: `Bearer ${options.accountId}`,
        }),
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<CampaignResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to create campaign");
  }
}

export async function updateCampaign(
  campaignId: number,
  data: UpdateCampaignRequest,
  options?: ApiOptions,
): Promise<CampaignResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/campaigns/${campaignId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options?.accountId && {
            Authorization: `Bearer ${options.accountId}`,
          }),
        },
        body: JSON.stringify(data),
        signal: options?.signal,
      },
    );
    return handleApiResponse<CampaignResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to update campaign");
  }
}

export async function deleteCampaign(
  campaignId: number,
  options?: ApiOptions,
): Promise<void> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/campaigns/${campaignId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: options?.accountId
          ? {
              Authorization: `Bearer ${options.accountId}`,
            }
          : undefined,
        signal: options?.signal,
      },
    );
    return handleApiResponse<void>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to delete campaign");
  }
}
