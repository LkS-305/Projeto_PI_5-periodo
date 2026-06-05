import { randomUUID } from 'crypto';
import { CriarAgendamentoDto } from '../dtos/agendamento';

export class Agendamento {
  public readonly id: string;
  public user_id: string;
  public prestador_id: string;
  public dia_semana: string;
  public hora_inicio: string;
  public hora_fim: string;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: CriarAgendamentoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.user_id;
    this.prestador_id = props.prestador_id;
    this.dia_semana = props.dia_semana;
    this.hora_inicio = props.hora_inicio;
    this.hora_fim = props.hora_fim;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
