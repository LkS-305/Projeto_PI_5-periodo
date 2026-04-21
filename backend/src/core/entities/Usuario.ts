import { randomUUID } from "crypto";
import { AtualizarUsuarioDto, CriarUsuarioDto } from "../dtos/usuario";

export class Usuario  {
  public id: string;
  public user_id: string;
  public nome: string;
  public score: number;
  public email?: string;
  public senha?: string;
  public foto_url?: string;
  public readonly created_at: Date;
  public updated_at: Date

   constructor(props: CriarUsuarioDto) {
    this.id = randomUUID();
    this.user_id = props.user_id ?? '';
    this.nome = props.nome ?? '';
    this.score = props.score ?? 0;
    this.email = props.email;
    this.senha = props.senha;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
  
  public atualizarScore(novoScore: number): void{
    this.score = novoScore;
    this.updated_at = new Date();
  }

  public atualizarPerfil(dados: AtualizarUsuarioDto): void {
    this.nome = dados.nome ?? this.nome;
    this.foto_url = dados.foto_url ?? this.foto_url;
    this.updated_at = new Date();
}

}
