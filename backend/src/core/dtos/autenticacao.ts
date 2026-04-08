import { UserType } from './usuario';

export interface RegisterDto {
  email: string,
  senha: string,
  cpf: string,
}

export interface RegisterResponseDto {
  id: string,
  nome: string,
  email: string,
  cpf: string,
}

export interface LoginDto {
  email: string,
  senha: string
}

export interface LoginResponseDto {
  id: string,
  nome: string,
  tipo_usuario: UserType,
  token: string,
  refresh_token: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ForgotPasswordResponseDto {
  codigo: string
}

export interface ChangeForgotPasswordDto {
  email: string,
  codigo: string,
  nova_senha: string,
}

export interface ChangePasswordDto {
  id: string
  senha_atual: string,
  nova_senha: string
}
