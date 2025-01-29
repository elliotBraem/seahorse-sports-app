import {
  type GameResponse,
  type CreateGameRequest,
  type UpdateGameRequest,
  type PredictionResponse,
  type CreatePredictionRequest,
} from "@renegade-fanclub/types";
import { type ApiOptions, apiRequest } from "./types";

export async function listGames(options?: ApiOptions): Promise<GameResponse[]> {
  return apiRequest("/games", { options, requiresAuth: false });
}

export async function getGame(
  gameId: number,
  options?: ApiOptions,
): Promise<GameResponse> {
  return apiRequest(`/games/${gameId}`, { options, requiresAuth: false });
}

export async function getCurrentGames(
  options?: ApiOptions,
): Promise<GameResponse[]> {
  return apiRequest("/games/current", { options, requiresAuth: false });
}

export async function createPrediction(
  data: CreatePredictionRequest,
  options?: ApiOptions,
): Promise<PredictionResponse> {
  return apiRequest(`/games/predict`, {
    method: "POST",
    body: data,
    options,
  });
}

export async function getGamePredictions(
  gameId: number,
  options?: ApiOptions,
): Promise<PredictionResponse[]> {
  return apiRequest(`/games/${gameId}/predictions`, { options });
}

export async function getCurrentUserGamePrediction(
  gameId: number,
  options?: ApiOptions,
): Promise<PredictionResponse | null> {
  return apiRequest(`/games/${gameId}/current-user-prediction`, {
    options,
    requiresAuth: true,
  });
}

// Admin endpoints

export async function createGame(
  data: CreateGameRequest,
  options?: ApiOptions,
): Promise<GameResponse> {
  return apiRequest("/admin/games", {
    method: "POST",
    body: data,
    options,
  });
}

export async function updateGame(
  gameId: number,
  data: UpdateGameRequest,
  options?: ApiOptions,
): Promise<GameResponse> {
  return apiRequest(`/admin/games/${gameId}`, {
    method: "PATCH",
    body: data,
    options,
  });
}

export async function deleteGame(
  gameId: number,
  options?: ApiOptions,
): Promise<void> {
  return apiRequest(`/admin/games/${gameId}`, {
    method: "DELETE",
    options,
  });
}
