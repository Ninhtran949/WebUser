import axios from 'axios';

export interface ApiErrorResponse {
  message: string;
  status: number;
  data?: any;
}

export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isApiError(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'message' in response &&
    'status' in response
  );
}

export function isAxiosError(error: unknown): error is Error & { response?: { status?: number; data?: any } } {
  return error instanceof Error && 'response' in error;
}

// Type guard for checking array response
export function isArrayResponse<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}
