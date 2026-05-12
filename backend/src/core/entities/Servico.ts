import { CriarServicoDto } from "../dtos/servico";
import { randomUUID } from "crypto";

export type ServicoStatus = 'criado' | 'aceito' | 'recusado' | 'pagamento_pendente' | 'emAndamento' | 'cancelado' | 'finalizado';

export class Servico {
  public readonly id: string;
  public usuario_id: string; // FK para Usuário (Cliente)
  public prestador_id: string; // FK para Prestador
  public titulo: string;
  public descricao: string;
  public preco_acordado: number;
  public data_inicio: Date;
  public duracao: string;
  public categoria: string;
  public status: ServicoStatus;
  public nota_usuario?: number;
  public nota_prestador?: number;
  public nota?: number;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor(props: CriarServicoDto, id?: string) {
    this.id = id ?? randomUUID();
    this.usuario_id = props.usuario_id;
    this.prestador_id = props.prestador_id;
    this.titulo = props.titulo;
    this.descricao = props.descricao || '';
    this.preco_acordado = props.preco_acordado;
    this.data_inicio = props.data_inicio;
    this.duracao = props.duracao;
    this.categoria = props.categoria;
    this.status = 'criado'; // Valor padrão
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
