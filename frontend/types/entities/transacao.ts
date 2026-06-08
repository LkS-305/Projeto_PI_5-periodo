/** Inclui valores usados na API (`enviar` / `receber`) e dados legados em seed. */
export type TransacaoTipo =
  | "credito"
  | "debito"
  | "enviar"
  | "receber"
  | string;

export type TransacaoStatus =
  | "pendente"
  | "concluido"
  | "falhou"
  | "aprovada"
  | "cancelada"
  | "reembolsada"
  | string;

export interface Transacao {
  readonly id: string;
  servico_id: string;
  tipo: TransacaoTipo;
  status: TransacaoStatus;
  valor: string;
  descricao?: string;
  metodo_pagamento: string;
  asaas_payment_id?: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}
