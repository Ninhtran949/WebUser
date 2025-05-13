export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
  success: boolean;
  message?: string;
};

export type ApiResult<T> = {
  success: true;
  data: T;
  status: number;
} | {
  success: false;
  error: ApiError;
  status: number;
};

export const isApiError = (result: unknown): result is ApiError => {
  return (
    typeof result === 'object' &&
    result !== null &&
    'message' in result
  );
};

export const isApiResponse = <T>(result: unknown): result is ApiResponse<T> => {
  return (
    typeof result === 'object' &&
    result !== null &&
    'data' in result &&
    'status' in result &&
    'statusText' in result
  );
};
