import { AvaliarBy } from "@/types/dtos/avaliacao";

export interface Avaliacao {
  id: string,
  servico_id?: string,
  usuario_id?: string,
  prestador_id?: string, 
  nota: string,
  comentario?: string,
  media?: string,
  destinatario: AvaliarBy,
  created_at: Date,
  updated_at: Date,
}