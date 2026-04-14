import { cookies } from 'next/headers';

const BASE_URL = 'http://127.0.0.1:3000';

async function request<T>(endpoint: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('@Pi:token')?.value;

  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return {} as T;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ${response.status} ao acessar a API`);
  }

  return response.json() as Promise<T>;
}

export const apiServer = {
  get: <T>(url: string, init?: RequestInit) => 
    request<T>(url, { 
      method: 'GET', 
      ...init 
    }),

  post: <T>(url: string, body: any, init?: RequestInit) => 
    request<T>(url, { 
      method: 'POST', 
      body: JSON.stringify(body), 
      ...init 
    }),

  put: <T>(url: string, body: any, init?: RequestInit) => 
    request<T>(url, { 
      method: 'PUT', 
      body: JSON.stringify(body), 
      ...init 
    }),

  patch: <T>(url: string, body: any, init?: RequestInit) => 
    request<T>(url, { 
      method: 'PATCH', 
      body: JSON.stringify(body), 
      ...init 
    }),

  delete: (url: string, init?: RequestInit) => 
    request<void>(url, { 
      method: 'DELETE', 
      ...init 
    }),
};
