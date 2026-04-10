import { AtualizarPrestadorDto, CriarPrestadorDto } from "../dtos/prestador";

export class Prestador {
  public user_id: string;
  public nome: string;
  public bio: string;
  public score: number;
  public foto_url?: string;
  public status_verificacao?: string;
  public readonly created_at: Date;
  public updated_at: Date;

  constructor(props: CriarPrestadorDto) {
    this.user_id = props.user_id;
    this.nome = props.nome
    this.bio = props.bio;
    this.score = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
 
  public atualizarScore(novoScore: number): void{
    this.score = novoScore;
  }

  public atualizarStatusVerificacao(novoStatus: string): void{
    this.status_verificacao = novoStatus;
  }
  

  public atualizarPerfil(novoPrestador: AtualizarPrestadorDto): void {
    this.nome = novoPrestador.nome ?? this.nome;
    this.bio = novoPrestador.bio ?? this.bio;
    this.foto_url = novoPrestador.foto_url ?? this.foto_url;
    this.updated_at = new Date();
}

}
