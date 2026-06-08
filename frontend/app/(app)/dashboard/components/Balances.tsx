"use client";

import { useEffect, useMemo, useRef } from "react";
import { type Chart } from "chart.js/auto";
import "./Balances.css";
import { createInteractiveLineChart } from "./interactiveChart";
import { Carteira } from "@/types/entities/carteira";
import { Transacao } from "@/types/entities/transacao";
import { isRecebimentoPrestador } from "@/lib/utils/transacaoDisplay";

type BalancesProps = {
  carteira?: Carteira | null;
  transacoes?: Transacao[];
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export default function Balances({ carteira, transacoes = [] }: BalancesProps) {
  const summaryChartRef = useRef<HTMLCanvasElement | null>(null);

  const saldo     = parseFloat(carteira?.saldo ?? "0");
  const bloqueado = parseFloat(carteira?.saldo_bloqueado ?? "0");
  const disponivel = saldo - bloqueado;

  const entrada = useMemo(
    () =>
      transacoes.filter((t) => isRecebimentoPrestador(t)).reduce((s, t) => s + parseFloat(t.valor), 0),
    [transacoes],
  );

  // Últimos 5 dias com movimento para o gráfico
  const chartData = useMemo(() => {
    const hoje = new Date();
    const dias: Date[] = Array.from({ length: 5 }, (_, i) => {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() - (4 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const labels = dias.map((d) =>
      d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    );

    const values = dias.map((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return transacoes
        .filter((t) => {
          const dt = new Date(t.created_at);
          return dt >= d && dt < next && isRecebimentoPrestador(t);
        })
        .reduce((s, t) => s + parseFloat(t.valor), 0);
    });

    const yesterday = new Date(hoje);
    yesterday.setDate(hoje.getDate() - 1);
    const comparisonDateLabel = yesterday.toLocaleDateString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });

    return { labels, values, comparisonDateLabel };
  }, [transacoes]);

  // Últimas 10 transações para atividade recente
  const recentes = useMemo(
    () => [...transacoes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10),
    [transacoes],
  );

  useEffect(() => {
    if (!summaryChartRef.current) return;

    const max = Math.max(...chartData.values, 1) * 1.3;

    const chart: Chart = createInteractiveLineChart({
      canvas: summaryChartRef.current,
      labels: chartData.labels,
      values: chartData.values,
      comparisonValues: chartData.values.map((v) => v * 0.75),
      max,
      borderColor: "#e0c271",
      showXAxis: false,
      showYAxis: false,
      tooltipTitle: "Entrada",
      getComparisonDateLabel: () => chartData.comparisonDateLabel,
    });

    return () => { chart.destroy(); };
  }, [chartData]);

  return (
    <div className="balances-root">
      <div className="balances-title-row">
        <h2 className="balances-title">Saldos {formatCurrency(saldo)}</h2>
      </div>

      <button type="button" className="balances-select">
        Gerenciamento de repasses
      </button>

      <section className="balances-card">
        <h3 className="balances-section-title">Resumo do saldo</h3>

        <div className="balances-chart-wrap">
          <canvas ref={summaryChartRef} />
        </div>

        <div className="balances-table-head">
          <span>Tipo de pagamentos</span>
          <span>Valor</span>
        </div>

        <div className="balances-row">
          <span className="balances-type">
            <i className="balances-dot balances-dot--entry" /> Entrada
          </span>
          <strong>{formatCurrency(entrada)}</strong>
        </div>

        <div className="balances-row">
          <span className="balances-type">
            <i className="balances-dot balances-dot--available" /> Disponível
          </span>
          <strong>{formatCurrency(disponivel)}</strong>
        </div>
      </section>

      <section className="balances-activity">
        <h3 className="balances-section-title">Atividade recente</h3>

        <div className="balances-tabs">
          <button type="button" className="balances-tab balances-tab--active">
            Repasses
          </button>
          <button type="button" className="balances-tab">
            Todas as atividades
          </button>
        </div>

        {recentes.length === 0 ? (
          <div className="balances-empty">Nenhum repasse foi encontrado</div>
        ) : (
          <div className="balances-list">
            {recentes.map((t) => (
              <div key={t.id} className="balances-row">
                <span className="balances-type">
                  <i
                    className={`balances-dot ${isRecebimentoPrestador(t) ? "balances-dot--entry" : "balances-dot--available"}`}
                  />
                  {t.descricao ?? "Transação"}
                  <span style={{ marginLeft: 8, fontSize: "0.75rem", color: "#888" }}>
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </span>
                <strong style={{ color: isRecebimentoPrestador(t) ? "#2d6a4f" : "#c0392b" }}>
                  {isRecebimentoPrestador(t) ? "+" : "-"}
                  {formatCurrency(parseFloat(t.valor))}
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
