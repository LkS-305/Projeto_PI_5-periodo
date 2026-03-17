import { TransacaoType, TransacaoStatus, MetodosPagamento } from "./transacao";


export interface CriarServicoDto {
  criarServico: {
    user_id: string,
    prestador_id: string,
    id_agendamento: string,
    id_transacao: string,
    titulo: string,
    categoria: string
  },

  criarAgendamento: {
    prestador_id: string,
    dia_semana: string,
    hora_inicio: string,
    hora_fim: string,
  },

  criarTransacao: {
    carteira_id_usuario: string,
    carteira_id_prestador: string,
    tipo: TransacaoType,
    status: TransacaoStatus,
    valor: string,
    metodo_pagamento: MetodosPagamento
  },

}

export type ServicoStatus = 'emAndamento' | 'pendente' | 'aceito' | 'recusado' | 'cancelado' | 'finalizado';
