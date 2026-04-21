import { cookies } from 'next/headers';

type RequestOptions = {
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  next?: NextFetchRequestConfig;
};

async function apiServerFetch<T>(
  endpoint: string,
  method: string,
  options: RequestOptions = {}
): Promise<T> {
  const { headers, body, params, next } = options;

  // Acesso seguro aos cookies no lado do servidor
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const url = new URL(`${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL}${endpoint}`);

  if (params) {
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    // No Next.js Server, usamos 'next' para ISR/revalidação
    next: next || { revalidate: 0 }, 
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    throw new Error(`Server Fetch Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const apiServer = {
  get: <T>(endpoint: string, options?: RequestOptions) => apiServerFetch<T>(endpoint, 'GET', options),
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => apiServerFetch<T>(endpoint, 'POST', { ...options, body }),
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => apiServerFetch<T>(endpoint, 'PUT', { ...options, body }),
  delete: <T>(endpoint: string, options?: RequestOptions) => apiServerFetch<T>(endpoint, 'DELETE', options),
};
