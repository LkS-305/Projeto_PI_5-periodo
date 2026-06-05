import { MetodosPagamento } from "../entities/transacao";

export interface IniciarPagamentoDto {
  servico_id: string;
  user_id: string;
  cpf: string;
  nome: string;
  email: string;
  valor: string;
  metodo_pagamento: MetodosPagamento;
}
