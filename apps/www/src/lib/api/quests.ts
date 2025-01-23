import {
  type QuestResponse,
  type QuestCompletionResponse,
  type CreateQuestRequest,
  type UpdateQuestRequest,
  type CompleteQuestRequest,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function listQuests(
  options?: ApiOptions,
): Promise<QuestResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/quests`, {
      method: "GET",
      credentials: "include",
      headers: options?.accountId
        ? {
            Authorization: `Bearer ${options.accountId}`,
          }
        : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<QuestResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to fetch quests");
  }
}

export async function getUserQuests(
  options?: ApiOptions,
): Promise<QuestCompletionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/mine`, {
      method: "GET",
      credentials: "include",
      headers: options?.accountId
        ? {
            Authorization: `Bearer ${options.accountId}`,
          }
        : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<QuestCompletionResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to fetch user quests");
  }
}

export async function completeQuest(
  questId: number,
  data: CompleteQuestRequest,
  options?: ApiOptions,
): Promise<QuestCompletionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/quests/${questId}/complete`, {
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
    return handleApiResponse<QuestCompletionResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to complete quest");
  }
}

// Admin endpoints

export async function createQuest(
  data: CreateQuestRequest,
  options?: ApiOptions,
): Promise<QuestResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/quests`, {
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
    return handleApiResponse<QuestResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to create quest");
  }
}

export async function updateQuest(
  questId: number,
  data: UpdateQuestRequest,
  options?: ApiOptions,
): Promise<QuestResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/quests/${questId}`, {
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
    });
    return handleApiResponse<QuestResponse>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to update quest");
  }
}

export async function deleteQuest(
  questId: number,
  options?: ApiOptions,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/quests/${questId}`, {
      method: "DELETE",
      credentials: "include",
      headers: options?.accountId
        ? {
            Authorization: `Bearer ${options.accountId}`,
          }
        : undefined,
      signal: options?.signal,
    });
    return handleApiResponse<void>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "Failed to delete quest");
  }
}
