"use client";

import { useEffect, useRef } from "react";
import { type Chart } from "chart.js/auto";
import "./Balances.css";
import { createInteractiveLineChart } from "./interactiveChart";

export default function Balances() {
  const summaryChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!summaryChartRef.current) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const comparisonDateLabel = yesterday.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const chart: Chart = createInteractiveLineChart({
      canvas: summaryChartRef.current,
      labels: ["08:00", "11:00", "14:00", "17:00", "20:00"],
      values: [120, 185, 240, 210, 265],
      comparisonValues: [95, 130, 180, 170, 220],
      max: 300,
      borderColor: "#e0c271",
      showXAxis: false,
      showYAxis: false,
      tooltipTitle: "Saldo",
      getComparisonDateLabel: () => comparisonDateLabel,
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="balances-root">
      <div className="balances-title-row">
        <h2 className="balances-title">Saldos R$ 0,00</h2>
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
          <strong>R$ 0,00</strong>
        </div>

        <div className="balances-row">
          <span className="balances-type">
            <i className="balances-dot balances-dot--available" /> Disponivel
          </span>
          <strong>R$ 0,00</strong>
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

        <div className="balances-empty">Nenhum repasse foi encontrado</div>
      </section>
    </div>
  );
}
