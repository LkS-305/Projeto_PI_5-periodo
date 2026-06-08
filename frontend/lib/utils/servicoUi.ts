import type { Servico, ServicoStatus } from "@/types/entities/servico";

/** Normaliza status vindos da API (camelCase ou snake_case). */
export function parseServicoStatus(raw: string | undefined): ServicoStatus {
  const s = String(raw ?? "criado")
    .replace(/_/g, "")
    .toLowerCase();
  const map: Record<string, ServicoStatus> = {
    criado: "criado",
    emandamento: "emAndamento",
    pendente: "pendente",
    aceito: "aceito",
    recusado: "recusado",
    cancelado: "cancelado",
    finalizado: "finalizado",
  };
  return map[s] ?? "criado";
}

export function isServicoAtivo(s: Pick<Servico, "status">): boolean {
  const st = parseServicoStatus(s.status as string);
  return !["cancelado", "finalizado", "recusado"].includes(st);
}

export function labelServicoStatus(s: Pick<Servico, "status">): string {
  const st = parseServicoStatus(s.status as string);
  const labels: Record<ServicoStatus, string> = {
    criado: "Criado",
    emAndamento: "Em andamento",
    pendente: "Pendente",
    aceito: "Aceito",
    recusado: "Recusado",
    cancelado: "Cancelado",
    finalizado: "Finalizado",
  };
  return labels[st] ?? String(s.status);
}
