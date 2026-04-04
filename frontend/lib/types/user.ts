export type UserType = "cliente" | "prestador" | "admin";

export interface Usuario {
  id?: string;
  nome: string;
  email: string;
  senha?: string;
  cpf?: string;
  telefone?: string;
  score?: string;
  tipo_usuario: UserType;
  foto_url?: string;
  created_at?: string;
  updated_at?: string;
  last_access?: string;
}
