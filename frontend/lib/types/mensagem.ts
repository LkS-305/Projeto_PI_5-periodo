export type MensagemTipoMidia = 'texto' | 'imagem' | 'audio';

export interface Mensagem {
  id?: string;
  servico_id: string;
  remetente_id: string;
  conteudo: string;
  tipo_midia: MensagemTipoMidia;
  lida_em?: string;
}

export interface CriarMensagemDto {
  servico_id: string;
  remetente_id: string;
  conteudo: string;
  tipo_midia?: MensagemTipoMidia;
}
