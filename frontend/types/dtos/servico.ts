export type ServicoStatus =
  | "criado"
  | "emAndamento"
  | "pendente"
  | "aceito"
  | "recusado"
  | "cancelado"
  | "finalizado";

export interface CriarServicoDto {
  user_id: string;
  prestador_id: string;
  categoria_id: string;
  titulo: string;
  descricao: string;
  preco_acordado: number;
  data_inicio: Date | string;
  duracao: string;
  categoria: string;
  status: ServicoStatus;
}

/** PATCH `/servico/atualizarServico` — alinhado ao backend. */
export type AtualizarServicoDto = {
  id: string;
  titulo?: string;
  descricao?: string;
  preco_acordado?: number;
  data_inicio?: string | Date;
  duracao?: string;
  categoria?: string;
};
