import { randomUUID } from "crypto";
import { CriarServicoDto, ServicoStatus } from "../dtos/servico";

export class Servico {
  public readonly id?: string;
  public user_id: string;      // FK para Usuário (Cliente)
  public prestador_id: string; // FK para Prestador
  public categoria_id: string;
  public titulo: string;
  public descricao: string;
  public preco_acordado: number;
  public data_inicio: Date;
  public nova_data?: Date;
  public duracao: string;
  public categoria: string;
  public status: ServicoStatus;
  public url_fotos?: string;
  public nota_usuario?: number;
  public nota_prestador?: number;
  public nota?: number;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: CriarServicoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.user_id = props.usuario_id;
    this.prestador_id = props.prestador_id;
    this.categoria_id = props.categoria_id;
    this.titulo = props.titulo;
    this.descricao = props.descricao;
    this.preco_acordado = props.preco_acordado;
    this.data_inicio = props.data_inicio;
    this.duracao = props.duracao;
    this.categoria = props.categoria;
    this.status = props.status;
    this.created_at = new Date();
    this.updated_at = new Date();
  }


  public atualizarData(nova_data?: Date, aceito?: boolean): void{
    
    if (!this.nova_data) {
      this.nova_data = nova_data;
    } else {
        if (aceito == true) {
          this.data_inicio = this.nova_data;
          this.nova_data = undefined;
        }
    }
  }
}
