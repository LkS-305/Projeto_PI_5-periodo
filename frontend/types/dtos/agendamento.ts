export interface CriarAgendamentoDto {
  servico_id: string,
  data_inicio: Date,
  data_fim: Date,
}

export interface AtualizarAgendamentoDto {
  servico_id: string,
  data_inicio: Date,
  data_fim: Date,
}
