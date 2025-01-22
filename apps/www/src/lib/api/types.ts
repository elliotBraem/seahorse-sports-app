const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_BASE_URL = `${API_URL}/api/v1`;

export type ApiResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type ApiOptions = {
  signal?: AbortSignal;
};

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json();
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred'
      }
    };
  }

  const data = await response.json();
  return {
    success: true,
    data
  };
}
