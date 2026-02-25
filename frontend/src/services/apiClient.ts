import { API_BASE_URL } from '../constants/routes';
import { getAccessToken } from './auth';

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw JSON.stringify(await response.json());
    }

    return response.json();
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw JSON.stringify(await response.json());
    }

    return response.json();
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw JSON.stringify(await response.json());
    }

    return response.json();
  },

  async delete<T>(path: string): Promise<T> {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw JSON.stringify(await response.json());
    }

    return response.json();
  },
};
