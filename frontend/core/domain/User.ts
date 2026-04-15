export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'CLIENTE' | 'PRESTADOR';
}

export interface AuthResponse {
  user: User;
  token: string;
}
