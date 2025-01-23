import { useAuthStore } from "../store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = `${API_URL}/api/v1`;

export type ApiOptions = {
  signal?: AbortSignal;
};

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestConfig = {
  method?: string;
  body?: any;
  requiresAuth?: boolean;
  options?: ApiOptions;
};

export async function apiRequest<T>(
  endpoint: string,
  { method = "GET", body, requiresAuth = true, options }: RequestConfig = {},
): Promise<T> {
  const headers: Record<string, string> = {};

  // Add auth header if required and accountId exists
  if (requiresAuth) {
    const accountId = useAuthStore.getState().accountId;
    if (accountId) {
      headers.Authorization = `Bearer ${accountId}`;
    }
  }

  // Add content-type for requests with body
  if (body) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    return handleApiResponse<T>(response);
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("UNKNOWN_ERROR", "An unknown error occurred");
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok || data.success === false) {
    const error = data.error || {};
    throw new ApiError(
      error.code || "UNKNOWN_ERROR",
      error.message || "An unknown error occurred",
    );
  }

  if (!data.success) {
    throw new ApiError("INVALID_RESPONSE", "Invalid API response format");
  }

  return data.data;
}
