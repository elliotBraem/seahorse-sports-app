import {
  type TeamResponse,
  type TeamFansPageResponse,
} from '@renegade-fanclub/types';
import { API_BASE_URL, type ApiResponse, type ApiOptions, handleApiResponse } from './types';

export async function listTeams(options?: ApiOptions): Promise<ApiResponse<TeamResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/teams`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<TeamResponse[]>(response);
}

export async function getTeam(
  teamId: number,
  options?: ApiOptions
): Promise<ApiResponse<TeamResponse>> {
  const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<TeamResponse>(response);
}

export async function getTeamFans(
  teamId: number,
  page: number = 1,
  limit: number = 20,
  options?: ApiOptions
): Promise<ApiResponse<TeamFansPageResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/teams/${teamId}/fans?${params}`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<TeamFansPageResponse>(response);
}
