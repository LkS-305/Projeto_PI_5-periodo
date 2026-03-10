export class Agenda {
  public readonly id?: string;
  public prestador_id!: string;
  public dia_semana!: number; // 0-6
  public hora_inicio!: string; // HH:mm
  public hora_fim!: string;
  public intervalo_minimo!: number;

  constructor(props: Omit<Agenda, 'id'>, id?: string) {
    Object.assign(this, props);
    this.id = id;
  }
}
