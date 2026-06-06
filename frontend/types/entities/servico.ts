export type ServicoStatus = 'criado' | 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';

export interface Servico {
  readonly id: string;
  user_id: string;
  prestador_id: string;
  categoria_id: string;
  titulo: string;
  descricao?: string;
  imagem?: string;
  preco_acordado: number;
  data_inicio: Date;
  duracao: string;
  categoria: string;
  ativo: boolean;
  status: ServicoStatus;
  nota_usuario?: number;
  nota_prestador?: number;
  nota?: number;
  total_avaliacoes?: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
