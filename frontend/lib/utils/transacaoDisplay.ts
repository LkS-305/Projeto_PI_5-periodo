import type { Transacao } from "@/types/entities/transacao";

/** Entradas na carteira do prestador (API atual + valores legados no seed). */
export function isRecebimentoPrestador(t: Pick<Transacao, "tipo">): boolean {
  const tipo = String(t.tipo).toLowerCase();
  return tipo === "receber" || tipo === "credito";
}
