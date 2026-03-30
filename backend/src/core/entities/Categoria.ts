export class Categoria {
  public id?: string;
  public nome: string;
  public slug: string;
  public icon_url: string;
  public created_at?: Date;
  public updated_at?: Date;

   constructor(props: Omit<Categoria, 'id' | 'created_at'>, id?: string) {
   this.nome = props.nome;
   this.slug = props.slug;
   this.icon_url = props.icon_url;
   this.id = id;

  }
} 
