import { randomUUID } from 'crypto';
import { CriarAgendamentoDto } from '../dtos/agendamento';


export class Agendamento {
  public readonly id: string;
  public servico_id: string;
  public data_inicio: Date;
  public data_fim: Date; 
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: CriarAgendamentoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.servico_id = props.servico_id;
    this.data_inicio = props.data_inicio;
    this.data_fim = props.data_fim;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
