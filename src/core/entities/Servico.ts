export class Servico {
  public readonly id?: string;
  public user_id: string;      // FK para Usuário (Cliente)
  public prestador_id: string; // FK para Prestador
  public titulo: string;
  public preco_acordado: number;
  public data_acordada: Date;
  public duracao: string;
  public categoria: string;
  public avaliacoes?: string;
  public nota_usuario?: number;
  public nota_prestador?: number;
  public nota?: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;

  constructor(props: Omit<Servico, 'id' | 'created_at' | 'updated_at'>, id?: string) {
    this.id = id;
    this.user_id = props.user_id;
    this.prestador_id = props.prestador_id;
    this.titulo = props.titulo;
    this.preco_acordado = props.preco_acordado;
    this.data_acordada = props.data_acordada;
    this.duracao = props.duracao;
    this.categoria = props.categoria;
    this.avaliacoes = props.avaliacoes;
    this.nota_usuario = props.nota_usuario;
    this.nota_prestador = props.nota_prestador;
    this.nota = props.nota;
  }
}
