export type CarteiraStatus = 'ativa' | 'bloqueada' | 'em_verificacao';

export type Cartao = {
    numero: string;
    validade: string;
    senha: string;
    nome: string;
}

export type PagamentosAceitados = {
    pix: string;
    cartoes: Cartao[];
    dinheiro: string;
}

export interface Carteira {
  id?: string;
  usuario_id?: string;
  user_id?: string | null;
  prestador_id?: string | null;
  saldo: string;
  saldo_bloqueado?: string;
  ultima_transacao_id?: string;
  /** Texto JSON ou objeto conforme vem da API. */
  metodos_de_pagamento?: PagamentosAceitados | string | Record<string, unknown> | null;
  status: CarteiraStatus;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}