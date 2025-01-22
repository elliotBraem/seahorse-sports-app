import {
  type GameResponse,
  type CreateGameRequest,
  type UpdateGameRequest,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiResponse,
  type ApiOptions,
  handleApiResponse,
} from "./types";

export async function listGames(
  options?: ApiOptions,
): Promise<ApiResponse<GameResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/games`, {
    method: "GET",
    credentials: "include",
    signal: options?.signal,
  });
  return handleApiResponse<GameResponse[]>(response);
}

export async function getGame(
  gameId: number,
  options?: ApiOptions,
): Promise<ApiResponse<GameResponse>> {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
    method: "GET",
    credentials: "include",
    signal: options?.signal,
  });
  return handleApiResponse<GameResponse>(response);
}

export async function getCurrentGames(
  options?: ApiOptions,
): Promise<ApiResponse<GameResponse[]>> {
  const response = await fetch(`${API_BASE_URL}/games/current`, {
    method: "GET",
    credentials: "include",
    signal: options?.signal,
  });
  return handleApiResponse<GameResponse[]>(response);
}

// Admin endpoints

export async function createGame(
  data: CreateGameRequest,
  options?: ApiOptions,
): Promise<ApiResponse<GameResponse>> {
  const response = await fetch(`${API_BASE_URL}/admin/games`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<GameResponse>(response);
}

export async function updateGame(
  gameId: number,
  data: UpdateGameRequest,
  options?: ApiOptions,
): Promise<ApiResponse<GameResponse>> {
  const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    signal: options?.signal,
  });
  return handleApiResponse<GameResponse>(response);
}

export async function deleteGame(
  gameId: number,
  options?: ApiOptions,
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}`, {
    method: "DELETE",
    credentials: "include",
    signal: options?.signal,
  });
  return handleApiResponse<void>(response);
}
