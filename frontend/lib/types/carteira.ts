export type CarteiraStatus = "ativa" | "bloqueada" | "em_verificacao";

export interface Cartao {
  numero: string;
  validade: string;
  senha: string;
  nome: string;
}

export interface PagamentosAceitos {
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
  metodos_de_pagamento?: PagamentosAceitos;
  status: CarteiraStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CriarCarteiraDto {
  usuario_id?: string;
  prestador_id?: string;
  saldo: string;
  metodos_de_pagamento?: PagamentosAceitos;
  status: CarteiraStatus;
}
