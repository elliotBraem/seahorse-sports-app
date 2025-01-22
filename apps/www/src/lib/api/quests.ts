import {
  type QuestResponse,
  type QuestCompletionResponse,
  type CreateQuestRequest,
  type UpdateQuestRequest,
  type CompleteQuestRequest,
} from '@renegade-fanclub/types';
import { API_BASE_URL, type ApiResponse, type ApiOptions, handleApiResponse } from './types';

export async function listQuests(options?: ApiOptions): Promise<ApiResponse<QuestResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/quests`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<QuestResponse[]>(response);
}

export async function getUserQuests(options?: ApiOptions): Promise<ApiResponse<QuestCompletionResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/quests/mine`, {
    method: 'GET',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<QuestCompletionResponse[]>(response);
}

export async function completeQuest(
  questId: number,
  data: CompleteQuestRequest,
  options?: ApiOptions
): Promise<ApiResponse<QuestCompletionResponse>> {
  const response = await fetch(`${API_BASE_URL}/quests/${questId}/complete`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<QuestCompletionResponse>(response);
}

// Admin endpoints

export async function createQuest(
  data: CreateQuestRequest,
  options?: ApiOptions
): Promise<ApiResponse<QuestResponse>> {
  const response = await fetch(`${API_BASE_URL}/admin/quests`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<QuestResponse>(response);
}

export async function updateQuest(
  questId: number,
  data: UpdateQuestRequest,
  options?: ApiOptions
): Promise<ApiResponse<QuestResponse>> {
  const response = await fetch(`${API_BASE_URL}/admin/quests/${questId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<QuestResponse>(response);
}

export async function deleteQuest(
  questId: number,
  options?: ApiOptions
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/admin/quests/${questId}`, {
    method: 'DELETE',
    credentials: 'include',
    signal: options?.signal,
  });
  return handleApiResponse<void>(response);
}
