export class Notificacao {
  public readonly id?: string;
  public usuario_id!: string;
  public titulo!: string;
  public mensagem!: string;
  public tipo!: 'info' | 'sucesso' | 'alerta';
  public action_url?: string;
  public data_leitura?: Date;
  public created_at?: Date;

  constructor(props: Omit<Notificacao, 'id' | 'created_at'>, id?: string) {
    Object.assign(this, props);
    this.id = id;
  }
}
