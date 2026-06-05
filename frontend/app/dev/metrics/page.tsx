"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { MetricsSnapshot } from "@/types/metrics";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002").replace(
    /\/$/,
    "",
  );
const METRICS_SECRET =
  process.env.NEXT_PUBLIC_METRICS_SECRET?.trim() || "";

async function fetchMetrics(): Promise<MetricsSnapshot> {
  const headers = new Headers();
  if (METRICS_SECRET) {
    headers.set("X-Metrics-Secret", METRICS_SECRET);
  }
  const res = await fetch(`${API_BASE}/internal/metrics`, {
    headers,
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }
  return JSON.parse(text) as MetricsSnapshot;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return iso;
  }
}

export default function DevMetricsPage() {
  const [data, setData] = useState<MetricsSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      setError(null);
      const snap = await fetchMetrics();
      setData(snap);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => {
      setTick((t) => t + 1);
      void load();
    }, 2000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-2 border-b border-zinc-800 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-400/90">
              Desenvolvimento
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Métricas HTTP do backend
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-400">
              Atualização a cada 2s via{" "}
              <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">
                GET {API_BASE}/internal/metrics
              </code>
              . Útil enquanto corres testes de integração ou o fluxo demo.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/dashboard"
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-zinc-600 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800"
            >
              Início
            </Link>
          </div>
        </header>

        {!METRICS_SECRET && (
          <p className="rounded-lg border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-400">
            Se o backend tiver <code className="text-zinc-300">METRICS_SECRET</code>
            , define também{" "}
            <code className="text-zinc-300">NEXT_PUBLIC_METRICS_SECRET</code> no
            frontend (ver <code className="text-zinc-300">.env.example</code>).
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          >
            <strong className="font-medium">Erro ao carregar métricas:</strong>{" "}
            {error}
          </div>
        )}

        {data && (
          <>
            <p className="text-xs text-zinc-500">
              Último fetch local: {new Date().toLocaleTimeString("pt-BR")} ·
              atualizações: {tick}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Sucesso (2xx/3xx)" value={data.success} tone="emerald" />
              <MetricCard label="Erro cliente (4xx)" value={data.clientError} tone="amber" />
              <MetricCard label="Erro servidor (5xx)" value={data.serverError} tone="rose" />
              <MetricCard label="Sem resposta" value={data.noResponse} tone="violet" />
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h2 className="text-sm font-medium text-zinc-300">Resumo</h2>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Total contabilizado</dt>
                  <dd className="font-mono text-lg text-zinc-100">{data.total}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Última atualização (servidor)</dt>
                  <dd className="text-zinc-200">{formatTime(data.lastUpdatedAt)}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Contador iniciado em</dt>
                  <dd className="text-zinc-200">{formatTime(data.startedAt)}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h2 className="text-sm font-medium text-zinc-300">
                Últimos eventos ({data.lastIssues.length})
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="py-2 pr-3">Quando</th>
                      <th className="py-2 pr-3">Tipo</th>
                      <th className="py-2 pr-3">Método</th>
                      <th className="py-2 pr-3">Caminho</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lastIssues.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-zinc-500">
                          Nenhum erro ou “sem resposta” registado ainda.
                        </td>
                      </tr>
                    ) : (
                      data.lastIssues.map((row, i) => (
                        <tr
                          key={`${row.at}-${row.path}-${i}`}
                          className="border-b border-zinc-800/80 text-zinc-300"
                        >
                          <td className="py-2 pr-3 whitespace-nowrap">
                            {formatTime(row.at)}
                          </td>
                          <td className="py-2 pr-3">
                            <span
                              className={
                                row.kind === "no_response"
                                  ? "text-violet-300"
                                  : "text-amber-200"
                              }
                            >
                              {row.kind === "no_response"
                                ? "sem resposta"
                                : "HTTP erro"}
                            </span>
                          </td>
                          <td className="py-2 pr-3 font-mono">{row.method}</td>
                          <td className="max-w-[280px] truncate py-2 pr-3 font-mono text-zinc-400">
                            {row.path}
                          </td>
                          <td className="py-2 font-mono">
                            {row.status != null ? row.status : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "amber" | "rose" | "violet";
}) {
  const tones = {
    emerald: "border-emerald-900/50 bg-emerald-950/30 text-emerald-200",
    amber: "border-amber-900/50 bg-amber-950/30 text-amber-200",
    rose: "border-rose-900/50 bg-rose-950/30 text-rose-200",
    violet: "border-violet-900/50 bg-violet-950/30 text-violet-200",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
