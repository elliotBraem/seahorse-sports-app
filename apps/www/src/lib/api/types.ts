const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = `${API_URL}/api/v1`;

export type ApiOptions = {
  signal?: AbortSignal;
};

export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(
      error.code || "UNKNOWN_ERROR",
      error.message || "An unknown error occurred"
    );
  }

  const data = await response.json();
  return data;
}
