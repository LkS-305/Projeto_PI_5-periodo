export type TransacaoTipo = "enviar" | "receber";
export type TransacaoStatus =
  | "pendente"
  | "aprovada"
  | "cancelada"
  | "reembolsada";
export type MetodosPagamento = "Pix" | "Credito" | "Boleto";

export interface Transacao {
  readonly id: string;
  servico_id: string;
  tipo: TransacaoTipo;
  status: TransacaoStatus;
  valor: string;
  descricao?: string;
  metodo_pagamento: string;
  asaas_payment_id?: string;
  readonly created_at?: string | Date;
  readonly updated_at?: string | Date;
}

export interface IniciarPagamentoResponse {
  transacao: Transacao;
  pix?: {
    qrCodeImage: string | null;
    copyPaste: string | null;
    invoiceUrl: string | null;
  };
}
