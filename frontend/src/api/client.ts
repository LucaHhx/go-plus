import axios from 'axios';
import type { ApiResponse } from '@/types';

const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: unwrap data, handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Redirect to login if not already on auth pages
      const path = window.location.pathname;
      if (!path.startsWith('/login') && !path.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function post<T>(url: string, data?: unknown, config?: { headers?: Record<string, string> }): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data;
}

export async function get<T>(url: string, config?: { params?: Record<string, unknown> }): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data;
}

export async function put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data;
}

export async function del<T>(url: string): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data;
}

export default apiClient;
