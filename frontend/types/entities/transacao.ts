export type TransacaoTipo = 'credito' | 'debito';
export type TransacaoStatus = 'pendente' | 'concluido' | 'falhou';

export interface Transacao {
  readonly id: string;
  servico_id: string;
  tipo: TransacaoTipo;
  status: TransacaoStatus;
  valor: string;
  descricao?: string;
  metodo_pagamento: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}
