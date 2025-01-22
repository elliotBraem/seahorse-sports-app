import {
  type CampaignResponse,
  type CreateCampaignRequest,
  type UpdateCampaignRequest,
  type CampaignLeaderboardResponse,
} from '@renegade-fanclub/types';
import { API_BASE_URL, type ApiResponse, type ApiOptions, handleApiResponse } from './types';

export async function listCampaigns(options?: ApiOptions): Promise<ApiResponse<CampaignResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/campaigns`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<CampaignResponse[]>(response);
}

export async function getCampaign(
  campaignId: number,
  options?: ApiOptions
): Promise<ApiResponse<CampaignResponse>> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<CampaignResponse>(response);
}

export async function getCampaignLeaderboardDetailed(
  campaignId: number,
  options?: ApiOptions
): Promise<ApiResponse<CampaignLeaderboardResponse>> {
  const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/leaderboard`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<CampaignLeaderboardResponse>(response);
}

// Admin endpoints

export async function createCampaign(
  data: CreateCampaignRequest,
  options?: ApiOptions
): Promise<ApiResponse<CampaignResponse>> {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<CampaignResponse>(response);
}

export async function updateCampaign(
  campaignId: number,
  data: UpdateCampaignRequest,
  options?: ApiOptions
): Promise<ApiResponse<CampaignResponse>> {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<CampaignResponse>(response);
}

export async function deleteCampaign(
  campaignId: number,
  options?: ApiOptions
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/admin/campaigns/${campaignId}`, {
    method: 'DELETE',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<void>(response);
}
