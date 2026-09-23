const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('freeverse_jwt_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('freeverse_jwt_token', token);
  } else {
    localStorage.removeItem('freeverse_jwt_token');
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const json = await res.json().catch(() => ({
      success: res.ok,
      message: res.statusText || 'Server error',
    }));

    if (!res.ok) {
      const errorMsg = json.message || `Request failed with status ${res.status}`;
      return {
        success: false,
        message: errorMsg,
        errors: json.errors,
      };
    }

    return json;
  } catch (err: any) {
    console.warn(`[API Network Failure on ${endpoint}]`, err);
    let message = err.message || 'Network request failed';
    if (err.name === 'TypeError' || message === 'Failed to fetch') {
      message = 'Unable to connect to backend server (http://localhost:8080). Please ensure PostgreSQL database and Spring Boot backend are running.';
    }
    return {
      success: false,
      message,
    };
  }
}
