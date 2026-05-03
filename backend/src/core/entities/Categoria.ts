import { randomUUID } from "crypto";
import { CriarCategoriaDto, AtualizarCategoriaDto } from "../dtos/categoria";

export class Categoria {
  public id: string;
  public nome: string;
  public slug: string;
  public icon_url?: string;
  public readonly created_at: Date;
  public updated_at: Date;

   constructor(props: CriarCategoriaDto) {
   this.id = props.id ?? randomUUID();
   this.nome = props.nome;
   this.slug = props.slug;
   this.icon_url = props.icon_url;
   this.created_at = new Date();
   this.updated_at = new Date();
  }


  atualizarCategoria(dados: AtualizarCategoriaDto): void {
    this.nome = dados.nome ?? this.nome;
    this.slug = dados.slug ?? this.slug;
    this.icon_url = dados.icon_url ?? this.icon_url;
    this.updated_at = new Date();
  }
} 
