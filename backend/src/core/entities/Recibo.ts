export class Recibo {
  public readonly id?: string;
  public transacao_id!: string;
  public servico_id!: string;
  public codigo_verificacao!: string;
  public dados_fiscais_cliente!: object;
  public hash_integridade!: string;

  constructor(props: Omit<Recibo, 'id'>, id?: string) {
    Object.assign(this, props);
    this.id = id;
    this.transacao_id = props.transacao_id;
  }
}
