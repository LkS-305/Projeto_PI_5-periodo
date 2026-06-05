"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";
import { ServicoGateway } from "@/lib/gateways/ServicoGateway";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import { CategoriaGateway } from "@/lib/gateways/CategoriaGateway";
import { Servico } from "@/types/entities/servico";
import { ServicoStatus } from "@/types/dtos/servico";
import { formatDatePtBR, truncateText } from "@/utils/formatDisplay";

const STATUS_LABEL: Record<string, string> = {
  criado: "Aguardando análise",
  aberto: "Em aberto",
  pendente: "Proposta enviada",
  aceito: "Aguardando pagamento",
  emAndamento: "Em andamento",
  finalizado: "Finalizado",
  recusado: "Recusado",
  cancelado: "Cancelado",
};

type TabKey = "pendentes" | "andamento" | "historico";

const TAB_STATUSES: Record<TabKey, ServicoStatus[]> = {
  pendentes: ["criado", "pendente", "aberto"],
  andamento: ["aceito", "emAndamento"],
  historico: ["finalizado", "recusado", "cancelado"],
};

export default function ServicosPanel() {
  const router = useRouter();
  const { user } = useSession();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isPrestador, setIsPrestador] = useState(false);
  const [tab, setTab] = useState<TabKey>("pendentes");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nomesPrestador, setNomesPrestador] = useState<Record<string, string>>(
    {},
  );
  const [categoriaPorId, setCategoriaPorId] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setServicos([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [cats, prestador] = await Promise.all([
          CategoriaGateway.getAll(),
          PrestadorGateway.getByUserId(user!.id),
        ]);
        if (cancelled) return;

        const catMap: Record<string, string> = {};
        for (const c of cats) {
          if (c.id) catMap[c.id] = c.nome;
        }
        setCategoriaPorId(catMap);

        const souPrestador = !!prestador;
        setIsPrestador(souPrestador);

        const lista = souPrestador
          ? await ServicoGateway.getByPrestadorId(user!.id)
          : await ServicoGateway.getByUserId(user!.id);
        if (cancelled) return;

        setServicos(lista);

        if (!souPrestador && lista.length > 0) {
          const ids = [...new Set(lista.map((s) => s.prestador_id))];
          const entries = await Promise.all(
            ids.map(async (pid) => {
              try {
                const p = await PrestadorGateway.getByUserId(pid);
                return [pid, p?.nome ?? pid] as const;
              } catch {
                return [pid, pid] as const;
              }
            }),
          );
          if (!cancelled) {
            setNomesPrestador(Object.fromEntries(entries));
          }
        } else if (!cancelled) {
          setNomesPrestador({});
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : "Erro ao carregar serviços.",
          );
          setServicos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const filtrados = useMemo(
    () => ServicoGateway.filterByStatus(servicos, TAB_STATUSES[tab]),
    [servicos, tab],
  );

  return (
    <div className="servicos-panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28 }}>Meus serviços</h2>
        {!isPrestador && (
          <button
            type="button"
            onClick={() => router.push("/explore")}
            style={{
              padding: "10px 20px",
              background: "#3DBD7D",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Explorar prestadores
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {(["pendentes", "andamento", "historico"] as TabKey[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: tab === t ? "2px solid #C3A85E" : "1px solid #ddd",
              background: tab === t ? "#F5F0E6" : "#fff",
              cursor: "pointer",
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t === "pendentes"
              ? "Pendentes"
              : t === "andamento"
                ? "Em andamento"
                : "Histórico"}
          </button>
        ))}
      </div>

      {loadError && (
        <p style={{ color: "#b42318", marginBottom: 16 }} role="alert">
          {loadError}
        </p>
      )}

      {loading && <p>Carregando serviços…</p>}

      {!loading && !loadError && filtrados.length === 0 && (
        <p style={{ color: "#888" }}>Nenhum serviço nesta aba.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtrados.map((s) => {
          const catNome =
            s.categoria?.trim() ||
            (s.categoria_id ? categoriaPorId[s.categoria_id] : undefined) ||
            "Categoria";
          const prestadorNome = nomesPrestador[s.prestador_id];
          const precoNum = Number(s.preco_acordado);
          const temPreco = s.preco_acordado != null && !Number.isNaN(precoNum) && precoNum > 0;

          return (
            <article
              key={s.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #E8E4DA",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>{s.titulo}</h3>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: "#272727" }}>
                      {STATUS_LABEL[String(s.status ?? "criado")] ?? s.status}
                    </span>
                    <span style={{ margin: "0 0.35rem", color: "#ccc" }}>|</span>
                    <span>{catNome}</span>
                    <span style={{ margin: "0 0.35rem", color: "#ccc" }}>|</span>
                    <span>Criado em {formatDatePtBR(s.created_at)}</span>
                  </div>
                  {!isPrestador && prestadorNome && (
                    <p style={{ margin: "0 0 6px", fontSize: 14 }}>
                      Prestador:{" "}
                      <Link
                        href={`/prestador/${encodeURIComponent(s.prestador_id)}`}
                        style={{ color: "#2fa066", fontWeight: 600 }}
                        prefetch={false}
                      >
                        {prestadorNome}
                      </Link>
                    </p>
                  )}
                  {isPrestador && (
                    <p style={{ margin: "0 0 6px", fontSize: 14, color: "#555" }}>
                      Cliente (conta):{" "}
                      <code style={{ fontSize: 12 }}>{s.user_id}</code>
                    </p>
                  )}
                  {(s.data_inicio || s.duracao) && (
                    <p style={{ margin: "0 0 6px", fontSize: 13, color: "#666" }}>
                      {s.data_inicio && (
                        <>
                          Início previsto: {formatDatePtBR(s.data_inicio)}
                          {s.duracao ? ` · Duração: ${s.duracao}` : ""}
                        </>
                      )}
                      {!s.data_inicio && s.duracao && <>Duração: {s.duracao}</>}
                    </p>
                  )}
                  {s.descricao?.trim() && (
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: 14,
                        color: "#444",
                        lineHeight: 1.45,
                      }}
                    >
                      {truncateText(s.descricao, 220)}
                    </p>
                  )}
                  {temPreco && (
                    <p style={{ margin: "10px 0 0", fontWeight: 700, fontSize: 16 }}>
                      {precoNum.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "#aaa" }}>
                    ID: {s.id}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => router.push(`/messages?servico=${s.id}`)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      background: "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/servicos/${s.id}/acordo`)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "1px solid #C3A85E",
                      background: "#F5F0E6",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    Acordo
                  </button>
                  {!isPrestador && s.status === "aceito" && (
                    <button
                      type="button"
                      onClick={() => router.push(`/servicos/${s.id}/pagamento`)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: "#3DBD7D",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      Pagar
                    </button>
                  )}
                  {isPrestador && s.status === "emAndamento" && (
                    <button
                      type="button"
                      onClick={async () => {
                        await ServicoGateway.finalizarServico(s.id!);
                        setServicos((prev) =>
                          prev.map((x) =>
                            x.id === s.id ? { ...x, status: "finalizado" } : x,
                          ),
                        );
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: "#C3A85E",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
