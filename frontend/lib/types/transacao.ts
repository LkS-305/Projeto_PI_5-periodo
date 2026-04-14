export type TransacaoType = 'enviar' | 'receber';
export type TransacaoStatus = 'pendente' | 'aprovada' | 'cancelada' | 'reembolsada';
export type MetodosPagamento = 'Pix' | 'Credito' | 'Boleto';

export interface Transacao {
  id?: string;
  servico_id: string;
  tipo: TransacaoType;
  status: TransacaoStatus;
  valor: string;
  descricao?: string;
  metodo_pagamento: MetodosPagamento;
  created_at?: string;
  updated_at?: string;
}

export interface CriarTransacaoDto {
  servico_id: string;
  tipo: TransacaoType;
  status: TransacaoStatus;
  valor: string;
  metodo_pagamento: MetodosPagamento;
  descricao?: string;
}
