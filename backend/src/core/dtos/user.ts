export type UserType = 'User' | 'Prestador' | 'Usuario' | 'Admin'

export interface RegisterDto {
  id?: string,
  email: string,
  senha: string,
  cpf: string,
}

export interface LoginDto {
  email: string,
  senha: string
}

export interface AuthResponse {
  id: string,
  nome: string,
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
