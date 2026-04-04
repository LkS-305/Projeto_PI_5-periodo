export interface Recibo {
  id?: string;
  transacao_id: string;
  servico_id: string;
  codigo_verificacao: string;
  dados_fiscais_cliente: Record<string, unknown>;
  hash_integridade: string;
}

export interface CriarReciboDto {
  transacao_id: string;
  servico_id: string;
  codigo_verificacao: string;
  dados_fiscais_cliente: Record<string, unknown>;
  hash_integridade: string;
}
