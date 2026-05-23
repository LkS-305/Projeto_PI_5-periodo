export interface EnviarMensagemDto {
  servico_id: string;
  remetente_id: string;
  conteudo: string;
  tipo_midia?: "texto" | "imagem" | "audio";
}

export interface MarcarLidaDto {
  mensagem_id: string;
  remetente_id: string;
}
