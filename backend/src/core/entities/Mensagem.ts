export class Mensagem {
  public readonly id?: string;
  public servico_id!: string;
  public remetente_id!: string;
  public conteudo!: string;
  public tipo_midia!: 'texto' | 'imagem' | 'audio';
  public lida_em?: Date;

  constructor(props: Omit<Mensagem, 'id'>, id?: string) {
    Object.assign(this, props);
    this.tipo_midia = props.tipo_midia ?? 'texto';
    this.id = id;
  }
}
