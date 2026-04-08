import { UserType } from "./usuario";

export interface CriarPrestadorDto {
  user_id: string,
  nome: string,
  bio: string,
  score: number
}


export interface CriarPrestadorResponseDto {
  id: string,
  usuario_id: string,
  bio: string,
  score: string,
  status_verificacao: string,
  
}

export interface TornarsePrestadorDto {
  id: string,
}

export interface AtualizarPrestadorDto {
  user_id: string,
  nome?: string,
  bio?: string,
  foto_url?: string
}


