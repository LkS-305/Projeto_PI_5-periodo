export class Avaliacao {  
  public readonly id?: string;
  public servico_id?: string;
  public usuario_id?: string;
  public prestador_id?: string;
  public nota: number; // Ex: 1 a 5
  public comentario?: string;
  public media?: string;
  public destinatario: string;
  public readonly created_at?: Date;
  public upadted_at?: Date;

  constructor(props: Omit<Avaliacao, 'id' | 'created_at'>, id?: string) {
    if (props.nota < 1 || props.nota > 5) {
      throw new Error('A nota deve estar entre 1 e 5.');
    }
    
    this.servico_id = props.servico_id;
    this.usuario_id = props.usuario_id; 
    this.prestador_id = props.prestador_id;
    this.nota = props.nota; 
    this.destinatario = props.destinatario;
    this.comentario = props.comentario;
    this.media = props.media;
    this.id = id;
  }
}
