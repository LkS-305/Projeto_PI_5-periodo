export type ListBy = 'usuario' | 'prestador' | 'servico' | 'avaliacao';
export type AvaliarBy = 'usuario' | 'prestador' | 'servico' | 'avaliacao';

export interface CriarAvaliacaoDto {
  servico_id?: string,
  usuario_id?: string,
  prestador_id?: string,
  nota: string,
  comentario?: string,
  media?: string,
  destinatario: AvaliarBy,

}
