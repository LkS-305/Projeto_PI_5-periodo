import { AvaliarBy } from "../dtos/avaliacao";

export class Avaliacao {  
  public readonly id?: string;
  public servico_id?: string;
  public usuario_id?: string;
  public prestador_id?: string;
  public listBy?: string;
  public avaliarBy?: string;
  public nota: string; // Ex: 1 a 5
  public comentario?: string;
  public media?: string;
  public destinatario: AvaliarBy;
  public readonly created_at?: Date;
  public upadted_at?: Date;

  constructor(props: Omit<Avaliacao, 'created_at'>, id?: string) {
    
    this.servico_id = props.servico_id;
    this.usuario_id = props.usuario_id; 
    this.prestador_id = props.prestador_id;
    this.listBy = props.listBy;
    this.avaliarBy = props.avaliarBy;
    this.nota = props.nota; 
    this.destinatario = props.destinatario;
    this.comentario = props.comentario;
    this.media = props.media;
    this.id = id;
  }
}
