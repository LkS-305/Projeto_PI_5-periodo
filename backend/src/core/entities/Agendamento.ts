import { v4 as uuidv4 } from 'uuid';


export class Agendamento {
  readonly id: string;
  public prestador_id!: string;
  public data!: string; // DD-MM-YYYY
  public hora_inicio!: string; // HH:mm
  public hora_fim!: string;
  readonly created_at?: Date;
  readonly updated_at?: Date;

  constructor(props: Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>) {
    Object.assign(this, props);
    this.id = uuidv4();
  }
}
