import { AtualizarUsuarioDto, CriarUsuarioDto } from "../dtos/usuario";

export class Usuario  {
  public user_id: string;
  public nome?: string;
  public telefone?: string;
  public score?: number;
  public foto_url?: string;
  public readonly created_at?: Date;
  public updated_at?: Date

   constructor(dados: CriarUsuarioDto & { foto_url?: string }) {
    this.user_id = dados.user_id;
    this.nome = dados.nome;
    this.telefone = dados.telefone;
    this.foto_url = dados.foto_url;
    this.score = dados.score ?? 0;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  public atualizarScore(novoScore: number): void{
    this.score = novoScore;
    this.updated_at = new Date();
  }

  public atualizarPerfil(dados: AtualizarUsuarioDto): void {
    this.nome = dados.nome ?? this.nome;
    this.telefone = dados.telefone ?? this.telefone;
    this.foto_url= dados.foto_url ?? this.foto_url;
    this.updated_at = new Date();
}

}
