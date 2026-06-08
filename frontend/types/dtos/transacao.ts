import type { Transacao } from "../entities/transacao";

/** Alinhado a `MetodosPagamento` no backend (`Pix` | `Credito` | `Boleto`). */
export type MetodoPagamentoApi = "Pix" | "Credito" | "Boleto";

export type IniciarPagamentoPayload = {
  servico_id: string;
  user_id: string;
  cpf: string;
  nome: string;
  email: string;
  valor: string;
  metodo_pagamento: MetodoPagamentoApi;
};

export type IniciarPagamentoPix = {
  qrCodeImage: string | null;
  copyPaste: string | null;
  invoiceUrl: string | null;
};

export type IniciarPagamentoBoleto = {
  bankSlipUrl: string | null;
  identificationField: string | null;
  invoiceUrl: string | null;
};

export type IniciarPagamentoFaturaAsaas = {
  invoiceUrl: string | null;
};

export type IniciarPagamentoResponse = {
  transacao: Transacao;
  pix: IniciarPagamentoPix | null;
  boleto: IniciarPagamentoBoleto | null;
  faturaAsaas: IniciarPagamentoFaturaAsaas | null;
};
