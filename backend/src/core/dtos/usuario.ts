export type UserType = 'cliente' | 'prestador' | 'admin';

export interface AtualizarUsuarioDto {
  nome: string,
  foto_url: string,
}

