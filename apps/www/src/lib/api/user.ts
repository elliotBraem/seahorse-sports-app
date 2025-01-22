import {
  type ProfileResponse,
  type PredictionResponse,
  type SocialAccountResponse,
  type UpdateProfileRequest,
  type AddFavoriteTeamRequest,
  type CreatePredictionRequest,
  type AddSocialAccountRequest,
} from '@renegade-fanclub/types';
import { API_BASE_URL, type ApiResponse, type ApiOptions, handleApiResponse } from './types';

export async function getUserProfile(options?: ApiOptions): Promise<ApiResponse<ProfileResponse>> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<ProfileResponse>(response);
}

export async function updateUserProfile(
  data: UpdateProfileRequest,
  options?: ApiOptions
): Promise<ApiResponse<ProfileResponse>> {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<ProfileResponse>(response);
}

export async function addFavoriteTeam(
  data: AddFavoriteTeamRequest,
  options?: ApiOptions
): Promise<ApiResponse<ProfileResponse>> {
  const response = await fetch(`${API_BASE_URL}/user/favorites/teams`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<ProfileResponse>(response);
}

export async function removeFavoriteTeam(
  teamId: number,
  options?: ApiOptions
): Promise<ApiResponse<ProfileResponse>> {
  const response = await fetch(`${API_BASE_URL}/user/favorites/teams/${teamId}`, {
    method: 'DELETE',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<ProfileResponse>(response);
}

export async function createPrediction(
  data: CreatePredictionRequest,
  options?: ApiOptions
): Promise<ApiResponse<PredictionResponse>> {
  const response = await fetch(`${API_BASE_URL}/predictions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<PredictionResponse>(response);
}

export async function getUserPredictions(options?: ApiOptions): Promise<ApiResponse<PredictionResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/predictions/mine`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<PredictionResponse[]>(response);
}

export async function getGamePrediction(
  gameId: number,
  options?: ApiOptions
): Promise<ApiResponse<PredictionResponse>> {
  const response = await fetch(`${API_BASE_URL}/predictions/${gameId}`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<PredictionResponse>(response);
}

export async function addSocialAccount(
  data: AddSocialAccountRequest,
  options?: ApiOptions
): Promise<ApiResponse<SocialAccountResponse>> {
  const response = await fetch(`${API_BASE_URL}/user/social`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<SocialAccountResponse>(response);
}

export async function removeSocialAccount(
  platform: string,
  options?: ApiOptions
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/user/social/${platform}`, {
    method: 'DELETE',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<void>(response);
}

export async function getSocialAccounts(
  options?: ApiOptions
): Promise<ApiResponse<SocialAccountResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/user/social`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<SocialAccountResponse[]>(response);
}
