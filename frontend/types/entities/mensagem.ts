export interface Mensagem {
  id: string;
  servico_id: string;
  remetente_id: string;
  conteudo: string;
  tipo_midia: "texto" | "imagem" | "audio";
  created_at?: string;
  lida_em: string | null;
}
