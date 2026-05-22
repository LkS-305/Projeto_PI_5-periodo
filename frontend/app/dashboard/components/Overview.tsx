"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { type Chart } from "chart.js/auto";
import "./Overview.css";
import { createInteractiveLineChart } from "./interactiveChart";
import { Carteira } from "@/types/entities/carteira";
import { Transacao } from "@/types/entities/transacao";

type PeriodKey = "1d" | "7d" | "30d" | "1y";
type CompareKey =
  | "periodo-anterior"
  | "semana-anterior"
  | "mes-anterior"
  | "ano-anterior";

const PERIOD_OPTIONS: Array<{ key: PeriodKey; label: string }> = [
  { key: "1d", label: "1 dia" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "1y", label: "1 ano" },
];

const COMPARE_OPTIONS: Array<{ key: CompareKey; label: string }> = [
  { key: "periodo-anterior", label: "Período anterior" },
  { key: "semana-anterior", label: "Semana anterior" },
  { key: "mes-anterior", label: "Mês anterior" },
  { key: "ano-anterior", label: "Ano anterior" },
];

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDecimal(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function shiftDateByCompareMode(
  sourceDate: Date,
  compareMode: CompareKey,
  period: PeriodKey,
): Date {
  const date = new Date(sourceDate);

  if (compareMode === "periodo-anterior") {
    if (period === "1d") {
      date.setDate(date.getDate() - 1);
      return date;
    }

    if (period === "7d") {
      date.setDate(date.getDate() - 7);
      return date;
    }

    if (period === "30d") {
      date.setDate(date.getDate() - 30);
      return date;
    }

    date.setFullYear(date.getFullYear() - 1);
    return date;
  }

  if (compareMode === "semana-anterior") {
    date.setDate(date.getDate() - 7);
    return date;
  }

  if (compareMode === "mes-anterior") {
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  date.setFullYear(date.getFullYear() - 1);
  return date;
}

function buildOverviewSeries(period: PeriodKey, compareMode: CompareKey) {
  const now = new Date();
  const labels: string[] = [];
  const currentPointLabels: string[] = [];
  const comparisonPointLabels: string[] = [];

  let points = 24;

  if (period === "7d") {
    points = 7;
  }

  if (period === "30d") {
    points = 30;
  }

  if (period === "1y") {
    points = 12;
  }

  for (let i = 0; i < points; i += 1) {
    const pointDate = new Date(now);

    if (period === "1d") {
      pointDate.setHours(i, 0, 0, 0);
      labels.push(`${String(i).padStart(2, "0")}:00`);
      currentPointLabels.push(
        pointDate.toLocaleDateString("pt-BR") +
          ` ${String(i).padStart(2, "0")}:00`,
      );
    } else if (period === "1y") {
      pointDate.setDate(1);
      pointDate.setMonth(now.getMonth() - (points - 1 - i));
      labels.push(
        pointDate.toLocaleDateString("pt-BR", {
          month: "short",
          year: "2-digit",
        }),
      );
      currentPointLabels.push(
        pointDate.toLocaleDateString("pt-BR", {
          month: "2-digit",
          year: "numeric",
        }),
      );
    } else {
      pointDate.setDate(now.getDate() - (points - 1 - i));
      labels.push(
        pointDate.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
      );
      currentPointLabels.push(pointDate.toLocaleDateString("pt-BR") + " 12:00");
    }

    const comparisonDate = shiftDateByCompareMode(
      pointDate,
      compareMode,
      period,
    );
    comparisonPointLabels.push(
      period === "1y"
        ? comparisonDate.toLocaleDateString("pt-BR", {
            month: "2-digit",
            year: "numeric",
          })
        : comparisonDate.toLocaleDateString("pt-BR") +
            (period === "1d" ? ` ${labels[i]}` : " 12:00"),
    );
  }

  const factor =
    period === "1d" ? 1 : period === "7d" ? 1.1 : period === "30d" ? 1.3 : 1.5;

  const makeSeries = (base: number, amplitude: number) =>
    Array.from({ length: points }, (_, index) => {
      const oscillation = Math.sin(index / 2.4) * amplitude;
      return Math.max(base + oscillation + index * 2.2 * factor, 0);
    });

  const currentNet = makeSeries(85, 18);
  const currentGross = makeSeries(96, 22);
  const currentCustomers = makeSeries(0.2, 0.35).map((value) =>
    Number((value / 10).toFixed(2)),
  );

  const comparisonNet = currentNet.map((value, index) =>
    Number((value * (0.72 + (index % 5) * 0.015)).toFixed(2)),
  );
  const comparisonGross = currentGross.map((value, index) =>
    Number((value * (0.7 + (index % 4) * 0.02)).toFixed(2)),
  );
  const comparisonCustomers = currentCustomers.map((value, index) =>
    Number((value * (0.65 + (index % 3) * 0.08)).toFixed(2)),
  );

  return {
    labels,
    currentPointLabels,
    comparisonPointLabels,
    currentNet,
    comparisonNet,
    currentGross,
    comparisonGross,
    currentCustomers,
    comparisonCustomers,
  };
}

function buildTodaySeries(selectedDate: string) {
  const now = new Date();
  const labels = Array.from(
    { length: 24 },
    (_, hour) => `${String(hour).padStart(2, "0")}:00`,
  );

  const currentPointLabels = labels.map(
    (label) => `${now.toLocaleDateString("pt-BR")} ${label}`,
  );

  const comparisonDateLabel = new Date(
    `${selectedDate}T00:00:00`,
  ).toLocaleDateString("pt-BR");

  const comparisonPointLabels = labels.map(
    (label) => `${comparisonDateLabel} ${label}`,
  );

  const currentNet = Array.from({ length: 24 }, (_, index) => {
    const base = 76 + Math.sin(index / 3) * 19 + index * 1.8;
    return Number(Math.max(base, 0).toFixed(2));
  });

  const comparisonNet = currentNet.map((value, index) =>
    Number((value * (0.74 + (index % 4) * 0.03)).toFixed(2)),
  );

  return {
    labels,
    currentPointLabels,
    comparisonPointLabels,
    currentNet,
    comparisonNet,
  };
}

function buildRealOverviewSeries(
  transacoes: Transacao[],
  period: PeriodKey,
  compareMode: CompareKey,
) {
  const now = new Date();
  const points = period === "1d" ? 24 : period === "7d" ? 7 : period === "30d" ? 30 : 12;
  const labels: string[] = [];
  const currentPointLabels: string[] = [];
  const comparisonPointLabels: string[] = [];
  const currentNet: number[] = [];
  const currentGross: number[] = [];
  const currentCustomers: number[] = [];
  const comparisonNet: number[] = [];
  const comparisonGross: number[] = [];
  const comparisonCustomers: number[] = [];

  for (let i = 0; i < points; i++) {
    const pointDate = new Date(now);
    let periodStart: Date;
    let periodEnd: Date;

    if (period === "1d") {
      pointDate.setHours(i, 0, 0, 0);
      labels.push(`${String(i).padStart(2, "0")}:00`);
      currentPointLabels.push(`${now.toLocaleDateString("pt-BR")} ${String(i).padStart(2, "0")}:00`);
      periodStart = new Date(pointDate);
      periodEnd = new Date(pointDate);
      periodEnd.setHours(i + 1, 0, 0, 0);
    } else if (period === "1y") {
      pointDate.setDate(1);
      pointDate.setMonth(now.getMonth() - (points - 1 - i));
      labels.push(pointDate.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }));
      currentPointLabels.push(pointDate.toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" }));
      periodStart = new Date(pointDate.getFullYear(), pointDate.getMonth(), 1);
      periodEnd = new Date(pointDate.getFullYear(), pointDate.getMonth() + 1, 1);
    } else {
      pointDate.setDate(now.getDate() - (points - 1 - i));
      pointDate.setHours(0, 0, 0, 0);
      labels.push(pointDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }));
      currentPointLabels.push(`${pointDate.toLocaleDateString("pt-BR")} 12:00`);
      periodStart = new Date(pointDate);
      periodEnd = new Date(pointDate);
      periodEnd.setDate(periodEnd.getDate() + 1);
    }

    const curr = transacoes.filter((t) => {
      const d = new Date(t.created_at);
      return d >= periodStart && d < periodEnd;
    });
    const gross = curr.filter((t) => t.tipo === "credito").reduce((s, t) => s + parseFloat(t.valor), 0);
    const debit = curr.filter((t) => t.tipo === "debito").reduce((s, t) => s + parseFloat(t.valor), 0);
    currentGross.push(gross);
    currentNet.push(Math.max(gross - debit, 0));
    currentCustomers.push(curr.filter((t) => t.tipo === "credito").length);

    const compDate = shiftDateByCompareMode(new Date(pointDate), compareMode, period);
    comparisonPointLabels.push(
      period === "1y"
        ? compDate.toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })
        : `${compDate.toLocaleDateString("pt-BR")}${period === "1d" ? ` ${labels[i]}` : " 12:00"}`,
    );

    let compStart: Date;
    let compEnd: Date;
    if (period === "1d") {
      compStart = new Date(compDate); compStart.setHours(i, 0, 0, 0);
      compEnd   = new Date(compDate); compEnd.setHours(i + 1, 0, 0, 0);
    } else if (period === "1y") {
      compStart = new Date(compDate.getFullYear(), compDate.getMonth(), 1);
      compEnd   = new Date(compDate.getFullYear(), compDate.getMonth() + 1, 1);
    } else {
      compStart = new Date(compDate); compStart.setHours(0, 0, 0, 0);
      compEnd   = new Date(compDate); compEnd.setDate(compEnd.getDate() + 1);
    }

    const comp = transacoes.filter((t) => {
      const d = new Date(t.created_at);
      return d >= compStart && d < compEnd;
    });
    const cGross = comp.filter((t) => t.tipo === "credito").reduce((s, t) => s + parseFloat(t.valor), 0);
    const cDebit = comp.filter((t) => t.tipo === "debito").reduce((s, t) => s + parseFloat(t.valor), 0);
    comparisonGross.push(cGross);
    comparisonNet.push(Math.max(cGross - cDebit, 0));
    comparisonCustomers.push(comp.filter((t) => t.tipo === "credito").length);
  }

  return { labels, currentPointLabels, comparisonPointLabels, currentNet, comparisonNet, currentGross, comparisonGross, currentCustomers, comparisonCustomers };
}

function buildRealTodaySeries(transacoes: Transacao[], selectedDate: string) {
  const now = new Date();
  const labels = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
  const currentPointLabels  = labels.map((l) => `${now.toLocaleDateString("pt-BR")} ${l}`);
  const compDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString("pt-BR");
  const comparisonPointLabels = labels.map((l) => `${compDateLabel} ${l}`);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const compDate = new Date(`${selectedDate}T00:00:00`);

  const makeHourSeries = (base: Date) =>
    Array.from({ length: 24 }, (_, h) => {
      const s = new Date(base); s.setHours(h, 0, 0, 0);
      const e = new Date(base); e.setHours(h + 1, 0, 0, 0);
      return transacoes
        .filter((t) => { const d = new Date(t.created_at); return d >= s && d < e && t.tipo === "credito"; })
        .reduce((sum, t) => sum + parseFloat(t.valor), 0);
    });

  return { labels, currentPointLabels, comparisonPointLabels, currentNet: makeHourSeries(today), comparisonNet: makeHourSeries(compDate) };
}

type OverviewProps = {
  onViewBalances?: () => void;
  carteira?: Carteira | null;
  transacoes?: Transacao[];
};

export default function Overview({ onViewBalances, carteira, transacoes = [] }: OverviewProps) {
  const todayChartRef = useRef<HTMLCanvasElement | null>(null);
  const grossChartRef = useRef<HTMLCanvasElement | null>(null);
  const netChartRef = useRef<HTMLCanvasElement | null>(null);
  const customersChartRef = useRef<HTMLCanvasElement | null>(null);
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("7d");
  const [selectedCompareMode, setSelectedCompareMode] =
    useState<CompareKey>("periodo-anterior");
  const [openFilterMenu, setOpenFilterMenu] = useState<
    "period" | "compare" | null
  >(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
  });

  const series = useMemo(
    () => buildRealOverviewSeries(transacoes, selectedPeriod, selectedCompareMode),
    [transacoes, selectedPeriod, selectedCompareMode],
  );

  const todaySeries = useMemo(
    () => buildRealTodaySeries(transacoes, selectedDate),
    [transacoes, selectedDate],
  );

  const periodLabel = useMemo(
    () => PERIOD_OPTIONS.find((option) => option.key === selectedPeriod)?.label,
    [selectedPeriod],
  );

  const compareLabel = useMemo(
    () =>
      COMPARE_OPTIONS.find((option) => option.key === selectedCompareMode)
        ?.label,
    [selectedCompareMode],
  );

  const compareGranularityLabel = useMemo(() => {
    if (selectedPeriod === "1d") {
      return "Horária";
    }

    if (selectedPeriod === "1y") {
      return "Mensal";
    }

    return "Diária";
  }, [selectedPeriod]);

  const currentNetDisplay = useMemo(() => {
    const total = todaySeries.currentNet.reduce((s, v) => s + v, 0);
    return formatCurrency(total);
  }, [todaySeries.currentNet]);

  const previousNetDisplay = useMemo(() => {
    const total = todaySeries.comparisonNet.reduce((s, v) => s + v, 0);
    return formatCurrency(total);
  }, [todaySeries.comparisonNet]);

  const selectedDateLabel = useMemo(() => {
    const parsed = new Date(`${selectedDate}T00:00:00`);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      parsed.getFullYear() === yesterday.getFullYear() &&
      parsed.getMonth() === yesterday.getMonth() &&
      parsed.getDate() === yesterday.getDate();

    if (isYesterday) {
      return "Ontem";
    }

    return parsed.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [selectedDate]);

  const saldoBRL = formatCurrency(parseFloat(carteira?.saldo ?? "0"));

  const volumeBruto = useMemo(
    () => formatCurrency(series.currentGross.reduce((s, v) => s + v, 0)),
    [series.currentGross],
  );

  const volumeBrutoAnterior = useMemo(
    () => formatCurrency(series.comparisonGross.reduce((s, v) => s + v, 0)),
    [series.comparisonGross],
  );

  const volumeLiquido = useMemo(
    () => formatCurrency(series.currentNet.reduce((s, v) => s + v, 0)),
    [series.currentNet],
  );

  const volumeLiquidoAnterior = useMemo(
    () => formatCurrency(series.comparisonNet.reduce((s, v) => s + v, 0)),
    [series.comparisonNet],
  );

  const novosClientes = useMemo(
    () => series.currentCustomers.reduce((s, v) => s + v, 0),
    [series.currentCustomers],
  );

  const novosClientesAnterior = useMemo(
    () => series.comparisonCustomers.reduce((s, v) => s + v, 0),
    [series.comparisonCustomers],
  );

  const getComparisonDateLabel = useCallback(
    () =>
      new Date(`${selectedDate}T00:00:00`).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [selectedDate],
  );

  useEffect(() => {
    if (!todayChartRef.current) {
      return;
    }

    const maxToday =
      Math.max(...todaySeries.currentNet, ...todaySeries.comparisonNet, 1) *
      1.15;

    const todayChart = createInteractiveLineChart({
      canvas: todayChartRef.current,
      labels: todaySeries.labels,
      values: todaySeries.currentNet,
      comparisonValues: todaySeries.comparisonNet,
      max: maxToday,
      borderColor: "#e0c271",
      tooltipTitle: "Valor liquido",
      getComparisonDateLabel,
      getCurrentPointLabel: (_, index) =>
        todaySeries.currentPointLabels[index] ?? "",
      getComparisonPointLabel: (_, index) =>
        todaySeries.comparisonPointLabels[index] ?? "",
    });

    return () => {
      todayChart.destroy();
    };
  }, [getComparisonDateLabel, todaySeries]);

  useEffect(() => {
    const charts: Chart[] = [];

    if (grossChartRef.current) {
      const maxGross =
        Math.max(...series.currentGross, ...series.comparisonGross, 1) * 1.15;

      charts.push(
        createInteractiveLineChart({
          canvas: grossChartRef.current,
          labels: series.labels,
          values: series.currentGross,
          comparisonValues: series.comparisonGross,
          max: maxGross,
          borderColor: "#e0c271",
          tooltipTitle: "Valor bruto",
          getComparisonDateLabel,
          getCurrentPointLabel: (_, index) =>
            series.currentPointLabels[index] ?? "",
          getComparisonPointLabel: (_, index) =>
            series.comparisonPointLabels[index] ?? "",
        }),
      );
    }

    if (netChartRef.current) {
      const maxNet =
        Math.max(...series.currentNet, ...series.comparisonNet, 1) * 1.15;

      charts.push(
        createInteractiveLineChart({
          canvas: netChartRef.current,
          labels: series.labels,
          values: series.currentNet,
          comparisonValues: series.comparisonNet,
          max: maxNet,
          borderColor: "#e0c271",
          tooltipTitle: "Valor liquido",
          getComparisonDateLabel,
          getCurrentPointLabel: (_, index) =>
            series.currentPointLabels[index] ?? "",
          getComparisonPointLabel: (_, index) =>
            series.comparisonPointLabels[index] ?? "",
        }),
      );
    }

    if (customersChartRef.current) {
      const maxCustomers =
        Math.max(...series.currentCustomers, ...series.comparisonCustomers, 1) *
        1.15;

      charts.push(
        createInteractiveLineChart({
          canvas: customersChartRef.current,
          labels: series.labels,
          values: series.currentCustomers,
          comparisonValues: series.comparisonCustomers,
          max: maxCustomers,
          borderColor: "#e0c271",
          tooltipTitle: "Novos clientes",
          formatValue: formatDecimal,
          getComparisonDateLabel,
          getCurrentPointLabel: (_, index) =>
            series.currentPointLabels[index] ?? "",
          getComparisonPointLabel: (_, index) =>
            series.comparisonPointLabels[index] ?? "",
        }),
      );
    }

    return () => {
      charts.forEach((chart) => chart.destroy());
    };
  }, [getComparisonDateLabel, series]);

  return (
    <div className="overview-root">
      <section className="overview-card overview-card--today">
        <h2 className="overview-heading">Hoje</h2>

        <div className="overview-metrics-row">
          <div>
            <p className="overview-metric-label">Volume liquido</p>
            <p className="overview-metric-value">{currentNetDisplay}</p>
            <p className="overview-metric-sub">17:29</p>
          </div>
          <div>
            <button
              type="button"
              className="overview-date-btn"
              onClick={() => {
                if (datePickerRef.current?.showPicker) {
                  datePickerRef.current.showPicker();
                } else {
                  datePickerRef.current?.click();
                }
              }}
            >
              {selectedDateLabel}
              <Image
                src="/images/viewBox.svg"
                alt="ViewBox"
                width={25}
                height={10}
              />
            </button>
            <input
              ref={datePickerRef}
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="overview-date-input"
            />
            <p className="overview-metric-value">{previousNetDisplay}</p>
          </div>
        </div>

        <div className="overview-chart-wrap overview-chart-wrap--today">
          <canvas ref={todayChartRef} />
        </div>

        <div className="overview-summary-grid">
          <div>
            <p className="overview-summary-title">Saldo em BRL</p>
            <p className="overview-summary-value">{saldoBRL}</p>
          </div>
          <button
            type="button"
            className="overview-link-btn"
            onClick={onViewBalances}
          >
            Ver detalhes
          </button>
          <div>
            <p className="overview-summary-title">Repasses</p>
            <p className="overview-summary-value">-</p>
          </div>
          <button
            type="button"
            className="overview-link-btn"
            onClick={onViewBalances}
          >
            Ver detalhes
          </button>
        </div>
      </section>

      <section className="overview-card overview-card--vision">
        <div className="overview-vision-head">
          <h2 className="overview-heading">Sua visão geral</h2>
        </div>

        <div className="overview-filters">
          <div className="overview-filter-group">
            <button
              type="button"
              className="overview-chip"
              onClick={() =>
                setOpenFilterMenu((current) =>
                  current === "period" ? null : "period",
                )
              }
            >
              Período | {periodLabel}
            </button>

            {openFilterMenu === "period" ? (
              <div className="overview-filter-menu">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="overview-filter-item"
                    onClick={() => {
                      setSelectedPeriod(option.key);
                      setOpenFilterMenu(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            className="overview-chip overview-chip--readonly"
          >
            Comparacao | {compareGranularityLabel}
          </button>

          <div className="overview-filter-group">
            <button
              type="button"
              className="overview-chip"
              onClick={() =>
                setOpenFilterMenu((current) =>
                  current === "compare" ? null : "compare",
                )
              }
            >
              Comparar | {compareLabel}
            </button>

            {openFilterMenu === "compare" ? (
              <div className="overview-filter-menu">
                {COMPARE_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="overview-filter-item"
                    onClick={() => {
                      setSelectedCompareMode(option.key);
                      setOpenFilterMenu(null);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="overview-grid">
          <article className="overview-widget">
            <h3 className="overview-widget-title">Pagamentos</h3>
            <div className="overview-empty">Sem dados</div>
          </article>

          <article className="overview-widget">
            <h3 className="overview-widget-title">Volume bruto</h3>
            <p className="overview-widget-value">{volumeBruto}</p>
            <p className="overview-widget-sub">{volumeBrutoAnterior} período anterior</p>
            <div className="overview-chart-wrap">
              <canvas ref={grossChartRef} />
            </div>
            <p className="overview-widget-foot">Atualizado em ha 4 minutos</p>{" "}
            {/*Mudaremos aqui no futuro para inserção dos valores reais*/}
          </article>

          <article className="overview-widget">
            <h3 className="overview-widget-title">Volume líquido</h3>
            <p className="overview-widget-value">{volumeLiquido}</p>
            <p className="overview-widget-sub">{volumeLiquidoAnterior} período anterior</p>
            <div className="overview-chart-wrap">
              <canvas ref={netChartRef} />
            </div>
            <p className="overview-widget-foot">Atualizado em ha 4 minutos</p>
          </article>

          <article className="overview-widget">
            <h3 className="overview-widget-title">Pagamentos malsucedidos</h3>
            <div className="overview-empty">Sem dados</div>
          </article>

          <article className="overview-widget">
            <h3 className="overview-widget-title">Novos clientes</h3>
            <p className="overview-widget-value">{novosClientes}</p>
            <p className="overview-widget-sub">{novosClientesAnterior} período anterior</p>
            <div className="overview-chart-wrap">
              <canvas ref={customersChartRef} />
            </div>
            <p className="overview-widget-foot">Atualizado em ha 4 minutos</p>
          </article>
        </div>
      </section>
    </div>
  );
}
