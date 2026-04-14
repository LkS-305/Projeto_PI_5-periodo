export type AvaliarBy = "usuario" | "prestador" | "servico" | "avaliacao";

export interface Avaliacao {
  id?: string;
  servico_id?: string;
  usuario_id?: string;
  prestador_id?: string;
  listBy?: string;
  avaliarBy?: AvaliarBy;
  nota: string;
  comentario?: string;
  media?: string;
  destinatario: AvaliarBy;
  created_at?: string;
  updated_at?: string;
}

export interface CriarAvaliacaoDto {
  servico_id?: string;
  usuario_id?: string;
  prestador_id?: string;
  nota: string;
  comentario?: string;
  destinatario: AvaliarBy;
}
