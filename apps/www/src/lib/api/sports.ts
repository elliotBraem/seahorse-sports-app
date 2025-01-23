import { type Sport } from "@renegade-fanclub/types";
import {
  API_BASE_URL,
  type ApiOptions,
  handleApiResponse,
  ApiError,
} from "./types";

export async function listSports(
  options?: ApiOptions,
): Promise<Sport[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sports`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<Sport[]>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch sports");
  }
}

export async function getSport(
  sportId: number,
  options?: ApiOptions,
): Promise<Sport> {
  try {
    const response = await fetch(`${API_BASE_URL}/sports/${sportId}`, {
      method: "GET",
      credentials: "include",
      signal: options?.signal,
    });
    return handleApiResponse<Sport>(response);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError("UNKNOWN_ERROR", "Failed to fetch sport");
  }
}
