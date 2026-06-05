export type ServicoStatus =
  | "criado"
  | "aberto"
  | "emAndamento"
  | "pendente"
  | "aceito"
  | "recusado"
  | "cancelado"
  | "finalizado";

export type PrioridadeServico = "baixa" | "media" | "alta" | "urgente";

export interface AbrirServicoDto {
  user_id: string;
  prestador_id: string;
  categoria_id: string;
  titulo: string;
  prioridade: PrioridadeServico;
  descricao?: string;
  categoria?: string;
}

export interface CriarServicoDto extends AbrirServicoDto {
  preco_acordado?: number;
  data_inicio?: string | null;
  duracao?: string;
  status?: ServicoStatus;
}

export interface AtualizarServicoDto {
  id: string;
  titulo?: string;
  descricao?: string;
  preco_acordado?: number;
  data_inicio?: string;
  duracao?: string;
  categoria?: string;
}

export interface AtualizarStatusServicoDto {
  id: string;
  status: ServicoStatus;
}

export interface ProporAcordoDto {
  id: string;
  preco_acordado: number;
  data_inicio: string;
  duracao: string;
}
