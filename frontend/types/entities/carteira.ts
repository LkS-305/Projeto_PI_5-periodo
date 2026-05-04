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
  prestador_id?: string;
  saldo: string;
  saldo_bloqueado?: string;
  ultima_transacao_id?: string;
  metodos_de_pagamento?: PagamentosAceitados;
  status: CarteiraStatus;
  readonly created_at?: Date;
  readonly updated_at?: Date;
}