import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token automaticamente do LocalStorage (se existir)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@Pi:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const HttpClient = {
  async get<T>(url: string): Promise<T> {
    const { data } = await api.get<T>(url);
    return data;
  },

  async post<T>(url: string, body: any): Promise<T> {
    const { data } = await api.post<T>(url, body);
    return data;
  },

  async put<T>(url: string, body: any): Promise<T> {
    const { data } = await api.put<T>(url, body);
    return data;
  },

  async patch<T>(url: string, body: any): Promise<T> {
    const { data } = await api.patch<T>(url, body);
    return data;
  },

  async delete(url: string): Promise<void> {
    await api.delete(url);
  }
};;
