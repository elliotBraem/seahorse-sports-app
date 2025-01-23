import {
  type QuestResponse,
  type QuestCompletionResponse,
  type CreateQuestRequest,
  type UpdateQuestRequest,
  type CompleteQuestRequest,
} from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function listQuests(
  options?: ApiOptions,
): Promise<QuestResponse[]> {
  return apiRequest("/quests", { options, requiresAuth: false });
}

export async function getUserQuests(
  options?: ApiOptions,
): Promise<QuestCompletionResponse[]> {
  return apiRequest("/quests/mine", { options });
}

export async function completeQuest(
  questId: number,
  data: CompleteQuestRequest,
  options?: ApiOptions,
): Promise<QuestCompletionResponse> {
  return apiRequest(`/quests/${questId}/complete`, {
    method: "POST",
    body: data,
    options,
  });
}

// Admin endpoints

export async function createQuest(
  data: CreateQuestRequest,
  options?: ApiOptions,
): Promise<QuestResponse> {
  return apiRequest("/admin/quests", {
    method: "POST",
    body: data,
    options,
  });
}

export async function updateQuest(
  questId: number,
  data: UpdateQuestRequest,
  options?: ApiOptions,
): Promise<QuestResponse> {
  return apiRequest(`/admin/quests/${questId}`, {
    method: "PATCH",
    body: data,
    options,
  });
}

export async function deleteQuest(
  questId: number,
  options?: ApiOptions,
): Promise<void> {
  return apiRequest(`/admin/quests/${questId}`, {
    method: "DELETE",
    options,
  });
}
