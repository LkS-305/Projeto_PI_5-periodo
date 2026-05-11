import { randomUUID } from "crypto";
import { CriarServicoDto, ServicoStatus } from "../dtos/servico";

export class Servico {
  public readonly id?: string;
  public user_id: string;      // FK para Usuário (Cliente)
  public prestador_id: string; // FK para Prestador
  public categoria_id: string;
  public titulo: string;
  public preco_acordado: number;
  public status: ServicoStatus;
  public nota_usuario: number | undefined;
  public nota_prestador: number | undefined;
  public nota: number | undefined;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: CriarServicoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.user_id;
    this.prestador_id = props.prestador_id;
    this.categoria_id = props.categoria_id;
    this.titulo = props.titulo;
    this.preco_acordado = props.preco_acordado;
    this.status = props.status;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
