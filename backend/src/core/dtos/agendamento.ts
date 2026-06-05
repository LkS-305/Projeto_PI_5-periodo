/** Dados para criar registro alinhado à tabela `agendamentos` (init.sql). */
export interface CriarAgendamentoDto {
  user_id: string;
  prestador_id: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
}
