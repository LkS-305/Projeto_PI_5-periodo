export interface AvaliarUPRequest {
  usuario_id: string, 
  prestador_id: string, 
  nota: string, 
  comentario?: string, 
  media?: string
}

export interface AvaliarPURequest {
  prestador_id: string, 
  usuario_id: string, 
  nota: string, 
  comentario?: string, 
  media?: string
}

export interface AvaliarServicoRequest {
  servico_id: string, 
  nota: string, 
  usuario_id?: string, 
  prestador_id?: string, 
  comentario?: string, 
  media?: string
}
