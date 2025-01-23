const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = `${API_URL}/api/v1`;

export type ApiOptions = {
  signal?: AbortSignal;
  accountId?: string;
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

export async function handleApiResponse<T>(response: Response): Promise<T> {
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
