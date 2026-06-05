/** Rótulos para estado de serviço (API + UI). */

export const SERVICO_STATUS_LABEL: Record<string, string> = {
  criado: "Aguardando análise",
  aberto: "Aberto",
  pendente: "Proposta enviada",
  aceito: "Aguardando pagamento",
  emAndamento: "Em andamento",
  finalizado: "Concluído",
  recusado: "Recusado",
  cancelado: "Cancelado",
};

export function labelServicoStatus(status: string | null | undefined): string {
  if (status == null || status === "") return "—";
  return SERVICO_STATUS_LABEL[status] ?? status;
}
