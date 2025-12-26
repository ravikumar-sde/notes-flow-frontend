/**
 * API Client Configuration
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make an API request
 */
async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle empty responses (like 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      if (!response.ok) {
        throw new ApiError(
          'An error occurred',
          response.status
        );
      }
      return {} as T;
    }

    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: Record<string, unknown> = {};
    try {
      if (isJson) {
        data = await response.json();
      } else {
        // If not JSON, try to get text for error message
        const text = await response.text();
        if (!response.ok) {
          throw new ApiError(
            'Server returned an error',
            response.status,
            { message: text.substring(0, 200) } // Limit error text
          );
        }
        // For successful non-JSON responses, return empty object
        return {} as T;
      }
    } catch {
      // If JSON parsing fails
      if (!response.ok) {
        throw new ApiError(
          'Failed to parse server response',
          response.status
        );
      }
      return {} as T;
    }

    if (!response.ok) {
      // Provide more specific error messages for common status codes
      let errorMessage = (data.message as string) || (data.error as string) || 'An error occurred';

      // Handle authentication errors specifically
      if (response.status === 401) {
        errorMessage = errorMessage || 'Your session has expired. Please log in again.';
      } else if (response.status === 403) {
        errorMessage = errorMessage || 'You do not have permission to perform this action.';
      }

      throw new ApiError(
        errorMessage,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * GET request
 */
export async function get<T = unknown>(
  endpoint: string,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiRequest<T>(endpoint, {
    method: 'GET',
    headers,
  });
}

/**
 * POST request
 */
export async function post<T = unknown>(
  endpoint: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiRequest<T>(endpoint, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export async function put<T = unknown>(
  endpoint: string,
  body?: unknown,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiRequest<T>(endpoint, {
    method: 'PUT',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function del<T = unknown>(
  endpoint: string,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    headers,
  });
}

const api = {
  get,
  post,
  put,
  delete: del,
};

export default api;

