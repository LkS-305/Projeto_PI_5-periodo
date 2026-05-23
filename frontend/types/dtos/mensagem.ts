export interface EnviarMensagemDto {
  servico_id: string;
  conteudo: string;
  tipo_midia?: "texto" | "imagem" | "audio";
}
