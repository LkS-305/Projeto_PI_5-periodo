"use client";

import { Transacao } from "@/types/entities/transacao";
import Link from "next/link";
import "./Transactions.css";
import { formatDateTimePtBR } from "@/utils/formatDisplay";
import { isEntradaTipo } from "@/utils/transacaoTipo";

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  aprovada: "Aprovada",
  cancelada: "Cancelada",
  reembolsada: "Reembolsada",
};

export default function Transactions({
  transacoes = [],
}: {
  transacoes?: Transacao[];
}) {
  return (
    <div className="transactions-root">
      <h2 className="transactions-title">Transações</h2>

      {transacoes.length === 0 ? (
        <section className="transactions-hero">
          <h3 className="transactions-hero-title">Nenhuma transação ainda</h3>
          <p className="transactions-hero-text">
            Suas transações de pagamento aparecerão aqui após contratar serviços.
          </p>
        </section>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {transacoes.map((t) => (
            <article
              key={t.id}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: 16,
                border: "1px solid #E8E4DA",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontWeight: 600 }}>
                  R$ {Number(t.valor).toFixed(2)}
                </span>
                <span style={{ fontSize: 13, color: "#888" }}>
                  {STATUS_LABEL[t.status] ?? t.status}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#666" }}>
                {isEntradaTipo(t.tipo) ? "Entrada" : "Saída"} ·{" "}
                {t.metodo_pagamento}
              </p>
              {t.descricao?.trim() ? (
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#333" }}>
                  {t.descricao}
                </p>
              ) : null}
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888" }}>
                {formatDateTimePtBR(t.created_at)}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>
                <Link
                  href={`/servicos/${t.servico_id}/acordo`}
                  prefetch={false}
                  style={{ color: "#2fa066", fontWeight: 500 }}
                >
                  Ver serviço ({t.servico_id})
                </Link>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
