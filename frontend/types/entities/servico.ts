import { PrioridadeServico, ServicoStatus } from "../dtos/servico";

export type { ServicoStatus, PrioridadeServico };

export interface Servico {
  readonly id: string;
  user_id: string;
  prestador_id: string;
  categoria_id?: string;
  titulo: string;
  descricao?: string;
  preco_acordado?: number | string | null;
  data_inicio?: string | Date | null;
  duracao?: string | null;
  categoria?: string;
  status?: ServicoStatus | string | null;
  url_fotos?: string;
  nota_usuario?: number;
  nota_prestador?: number;
  nota?: number;
  total_avaliacoes?: number;
  readonly created_at?: string | Date;
  readonly updated_at?: string | Date;
}
