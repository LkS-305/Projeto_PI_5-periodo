import { Usuario } from "./user";
import { Prestador } from "./prestador";
import { Servico } from "./servico";

// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface SignUpRequest {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
}
