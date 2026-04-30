export interface Prestador {  
  user_id: string,
  nome: string,
  bio: string,
  score: number,
  foto_url?: string,
  status_verificacao?: string,
  created_at: Date,
  updated_at: Date,
}
