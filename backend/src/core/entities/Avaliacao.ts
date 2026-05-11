import { randomUUID } from "crypto";
import { CriarAvaliacaoDto, destinatario } from "../dtos/avaliacao";

export class Avaliacao {  
  public readonly id: string;
  public servico_id: string | undefined;
  public usuario_id: string | undefined;
  public prestador_id: string | undefined;
  public destinatario: destinatario;
  public nota: number;
  public comentario: string | undefined;
  public media: string | undefined;
  public readonly created_at: Date;
  public upadted_at: Date;

  constructor(props: CriarAvaliacaoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.servico_id = props.servico_id;
    this.usuario_id = props.usuario_id; 
    this.prestador_id = props.prestador_id;
    this.destinatario = props.destinatario;
    this.nota = props.nota; 
    this.comentario = props.comentario;
    this.media = props.media;
    this.created_at = new Date();
    this.upadted_at = new Date();
  }
}
