export type ServicoStatus =
  | "emAndamento"
  | "pendente"
  | "aceito"
  | "recusado"
  | "cancelado"
  | "finalizado";

export interface Servico {
  id?: string;
  user_id: string;
  prestador_id: string;
  titulo: string;
  preco_acordado: number;
  data_acordada: string;
  duracao: string;
  categoria: string;
  avaliacoes?: string;
  nota_usuario?: number;
  nota_prestador?: number;
  nota?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CriarServicoDto {
  user_id: string;
  prestador_id: string;
  endereco_id: string;
  titulo: string;
  categoria: string;
}
