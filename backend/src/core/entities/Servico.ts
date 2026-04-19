import { CriarServicoDto } from "../dtos/servico";
import { randomUUID } from "crypto";

export class Servico {
  public readonly id: string;
  public user_id: string; // FK para Usuário (Cliente)
  public prestador_id: string; // FK para Prestador
  public titulo: string;
  public preco_acordado: number;
  public data_inicio: Date;
  public duracao: string;
  public categoria: string;
  public nota_usuario?: number;
  public nota_prestador?: number;
  public nota?: number;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: CriarServicoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.user_id;
    this.prestador_id = props.prestador_id;
    this.titulo = props.titulo;
    this.preco_acordado = props.preco_acordado;
    this.data_inicio = props.data_inicio;
    this.duracao = props.duracao;
    this.categoria = props.categoria;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
