export interface CriarCategoriaDto {
  id?: string,
  nome: string,
  slug: string,
  icon_url?: string,
}

export interface AtualizarCategoriaDto {
  id: string,
  nome?: string,
  slug?: string,
  icon_url?: string,
}
