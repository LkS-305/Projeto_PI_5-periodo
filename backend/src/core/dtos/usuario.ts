export interface CriarUsuarioDto {
  user_id: string, 
  nome: string, 
  foto_url?: string
}

export interface AtualizarUsuarioDto {
  user_id: string,
  nome?: string;
  foto_url?: string;
}
