import { User } from '../entities/user';


export interface AuthResponse {
  user: Omit<User, 'senha'>,
  token: string,
}


export interface RegisterDto {
  id?: string,
  email: string,
  senha: string,
  cpf?: string,
  nome?: string,
  telefone?: string,
}


export interface LoginDto {
  email: string,
  senha: string,
}
