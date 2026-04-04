export interface CriarPrestadorDto {
  user_id: string,
  bio: string,
  categories: string,
}


export interface CriarPrestadorResponseDto {
  id: string,
  usuario_id: string,
  bio: string,
  score: string,
  status_verificacao: string,
  
}

export interface AtualizarPrestadorDto {
  bio?: string,
  scorePrestador?: string,
  categories?: string,
  status_verificacao?: string
}


