export interface CriarPrestadorDto {
user_id: string,
nome: string,
bio: string,
foto_url?: string,
}

export interface AtualizarPrestadorDto {
user_id: string,
nome?: string,
bio?: string,
foto_url?: string
}
