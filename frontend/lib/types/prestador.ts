import { Usuario } from './user';

export interface Prestador extends Usuario {
  user_id: string;
  bio: string;
  scorePrestador?: number;
}

export interface CriarPrestadorDto {
  user_id: string;
}
