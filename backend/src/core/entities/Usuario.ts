import { CriarUsuarioDto } from "../dtos/usuario";

export class Usuario  {
  public user_id: string;
  public nome: string;
  public score: number;
  public foto_url?: string;
  public readonly created_at: Date;
  public updated_at: Date
  
   constructor(props: CriarUsuarioDto) {
    this.user_id = props.user_id;
    this.nome = props.nome;
    this.score = 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  } 
  
  public atualizarScore(novoScore: number): void{
    this.score = novoScore;
    this.updated_at = new Date();
  }

  public atualizarPerfil(nome: string, email: string, foto_url: string): void {
    this.nome = nome ?? this.nome;
    this.foto_url = foto_url ?? this.foto_url;
    this.updated_at = new Date();
}

}
