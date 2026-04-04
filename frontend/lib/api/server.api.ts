import axios, { AxiosInstance } from "axios";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001";

export const createServerApi = (token?: string): AxiosInstance => {
  const serverApi = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 10000,
  });

  return serverApi;
};

export const serverApi = createServerApi();

export default serverApi;
