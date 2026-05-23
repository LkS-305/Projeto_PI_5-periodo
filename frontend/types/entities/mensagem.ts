export interface Mensagem {
  id: string;
  servico_id: string;
  remetente_id: string;
  conteudo: string;
  tipo_midia: "texto" | "imagem" | "audio";
  lida_em: string | null;
}
