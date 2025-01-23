import {
  type GameResponse,
  type CreateGameRequest,
  type UpdateGameRequest,
  type PredictionResponse,
  type CreatePredictionRequest,
} from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function listGames(
  options?: ApiOptions,
): Promise<GameResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/games`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<GameResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch games");
  }
}

export async function getGame(
  gameId: number,
  options?: ApiOptions,
): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<GameResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch game");
  }
}

export async function getCurrentGames(
  options?: ApiOptions,
): Promise<GameResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/games/current`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<GameResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch current games");
  }
}

export async function createPrediction(
  gameId: number,
  data: CreatePredictionRequest,
  options?: ApiOptions,
): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/predict`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
    return handleApiResponse<PredictionResponse>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to create prediction");
  }
}

export async function getGamePredictions(
  gameId: number,
  options?: ApiOptions,
): Promise<PredictionResponse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}/predictions`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<PredictionResponse[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch game predictions");
  }
}

// Admin endpoints

export async function createGame(
  data: CreateGameRequest,
  options?: ApiOptions,
): Promise<GameResponse> {
  try {
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
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to create game");
  }
}

export async function updateGame(
  gameId: number,
  data: UpdateGameRequest,
  options?: ApiOptions,
): Promise<GameResponse> {
  try {
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
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to update game");
  }
}

export async function deleteGame(
  gameId: number,
  options?: ApiOptions,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}`, {
      method: "DELETE",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<void>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to delete game");
  }
}
