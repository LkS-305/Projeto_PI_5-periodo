export interface Categoria {
  id?: string;
  nome: string;
  slug: string;
  icon_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CriarCategoriaDto {
  nome: string;
  slug: string;
  icon_url: string;
}
