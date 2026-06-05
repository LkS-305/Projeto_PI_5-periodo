export type destinatario = 'usuario' | 'prestador' | 'servico' | 'avaliacao';
export type ListBy = destinatario;

export interface CriarAvaliacaoDto {
  servico_id: string | undefined,
  usuario_id: string | undefined,
  prestador_id: string | undefined,
  nota: number,
  comentario: string | undefined,
  media: string | undefined,
  destinatario: destinatario,

}
