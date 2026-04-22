
export interface CriarUsuarioDto {
  user_id?: string;
  nome?: string;
  score?: number;
  email?: string;
  senha?: string;
}

export interface AtualizarUsuarioDto {
  user_id: string;
  nome: string;
  foto_url: string;
}
