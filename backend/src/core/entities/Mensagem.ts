export class Mensagem {
  public readonly id?: string;
  public servico_id!: string;
  public remetente_id!: string;
  public conteudo!: string;
  public tipo_midia!: 'texto' | 'imagem' | 'audio';   //TALVEZ TIRAR O AUDIO, POIS VAI SER MAIS COMPLICADO DE IMPLEMENTAR
  public created_at?: Date;       //ADICIONEI DATA DE CRIAÇÃO PARA ORDENAR AS MENSAGENS NA CONVERSA
  public lida_em?: Date;          //MARCADOR DE TEMPO PARA SABER QUANDO A MENSAGEM FOI LIDA PELO DESTINATÁRIO

  constructor(props: Omit<Mensagem, 'id'>, id?: string) {
    Object.assign(this, props);
    this.tipo_midia = props.tipo_midia ?? 'texto';
    this.id = id;
  }
}
