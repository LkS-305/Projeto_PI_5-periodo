export interface Agendamento {
  id?: string;
  user_id: string;
  prestador_id: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  created_at?: string;
  updated_at?: string;
}

export interface CriarAgendamentoDto {
  user_id: string;
  prestador_id: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
}
