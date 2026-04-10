export type UserType = 'Usuario' | 'Prestador' | 'Admin';

 export interface CriarUsuarioDto {
  user_id: string,
  nome: string,
  email: string,
  senha: string,
  cpf: string,
  score: number,
}
export interface AtualizarUsuarioDto {
  nome: string,
  foto_url: string,
}

