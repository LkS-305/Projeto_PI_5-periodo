"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { contractDetailPath, messagesWithServico, ROUTES } from "@/lib/routes";
import type { Servico, ServicoStatus } from "@/types/entities/servico";
import { labelServicoStatus, parseServicoStatus } from "@/lib/utils/servicoUi";
import "../shared/hub-list-page.css";

/** Filtro da lista — pedidos recebidos como prestador. */
type PedidoListFilter = "pendentes" | "em_curso" | "encerrados" | "todos";

function pedidoBucket(s: Servico): "pendentes" | "em_curso" | "encerrados" {
  const st = parseServicoStatus(s.status as string);
  if (st === "criado" || st === "pendente") return "pendentes";
  if (st === "aceito" || st === "emAndamento") return "em_curso";
  return "encerrados";
}

function pillClassForStatus(s: Servico): string {
  const st = parseServicoStatus(s.status as string);
  if (st === "criado" || st === "pendente") return "hub-pill hub-pill--pending";
  if (st === "aceito" || st === "emAndamento") return "hub-pill hub-pill--confirmed";
  if (st === "finalizado") return "hub-pill hub-pill--completed";
  if (st === "recusado" || st === "cancelado") return "hub-pill hub-pill--cancelled";
  return "hub-pill hub-pill--neutral";
}

function formatWhen(s: Servico): { date: string; time: string } {
  const raw = s.data_inicio as unknown as string | Date | undefined;
  const d = raw ? new Date(raw) : null;
  if (!d || isNaN(d.getTime())) return { date: "—", time: "—" };
  return {
    date: d.toLocaleDateString("pt-BR"),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

function precisaRespostaPrestador(s: Servico): boolean {
  const st = parseServicoStatus(s.status as string);
  return st === "criado" || st === "pendente";
}

export default function BookingsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<PedidoListFilter>("pendentes");
  const [pedidos, setPedidos] = useState<Servico[]>([]);
  const [clienteNomes, setClienteNomes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const loadPedidos = useCallback(async () => {
    const uid = getCurrentUserId();
    if (!uid) {
      setPedidos([]);
      setError("Inicie sessão para ver os pedidos recebidos como prestador.");
      return;
    }
    try {
      const lista = await ClientGateway.getServicosPorPrestador(uid);
      setPedidos(lista);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao carregar pedidos.");
      setPedidos([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await loadPedidos();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadPedidos]);

  useEffect(() => {
    if (!pedidos.length) {
      setClienteNomes({});
      return;
    }
    const ids = [...new Set(pedidos.map((p) => p.user_id))];
    let cancelled = false;
    (async () => {
      const pairs = await Promise.all(
        ids.map(async (id) => {
          try {
            const u = await ClientGateway.getUsuario(id);
            return [id, u?.nome?.trim() || "Cliente"] as const;
          } catch {
            return [id, "Cliente"] as const;
          }
        }),
      );
      if (!cancelled) setClienteNomes(Object.fromEntries(pairs));
    })();
    return () => {
      cancelled = true;
    };
  }, [pedidos]);

  const filtered = useMemo(() => {
    if (filter === "todos") return pedidos;
    return pedidos.filter((p) => pedidoBucket(p) === filter);
  }, [pedidos, filter]);

  const stats = useMemo(() => {
    let aguardando = 0;
    let emCurso = 0;
    let encerrados = 0;
    for (const p of pedidos) {
      const b = pedidoBucket(p);
      if (b === "pendentes") aguardando += 1;
      else if (b === "em_curso") emCurso += 1;
      else encerrados += 1;
    }
    return { aguardando, emCurso, encerrados, total: pedidos.length };
  }, [pedidos]);

  const handleResponder = async (id: string, novo: ServicoStatus) => {
    setActingId(id);
    setError(null);
    try {
      await ClientGateway.updateServicoStatus(id, novo);
      await loadPedidos();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Não foi possível atualizar o pedido.");
    } finally {
      setActingId(null);
    }
  };

  const filterButtons: { key: PedidoListFilter; label: string }[] = [
    { key: "pendentes", label: "Aguardando resposta" },
    { key: "em_curso", label: "Em curso" },
    { key: "encerrados", label: "Encerrados" },
    { key: "todos", label: "Todos" },
  ];

  return (
    <div className="hub-list-page">
      <div className="hub-list-page__shell">
        <button
          type="button"
          className="hub-list-page__back"
          onClick={() => router.push(ROUTES.hub)}
        >
          ← Voltar ao hub
        </button>
        <header className="hub-list-page__hero">
          <p className="hub-list-page__eyebrow">Modo profissional</p>
          <h1 className="hub-list-page__title">Pedidos</h1>
          <p className="hub-list-page__desc">
            Solicitações de serviço que os clientes enviaram para si. Responda aqui (aceitar ou
            recusar) e combine pormenores em Mensagens ou no contrato.
          </p>
        </header>

        <div className="hub-list-page__stats">
          <div className="hub-stat" data-accent="yellow">
            <p className="hub-stat__label">Aguardam a sua resposta</p>
            <p className="hub-stat__value">{stats.aguardando}</p>
            <p className="hub-stat__hint">Criados ou pendentes de aceitação</p>
          </div>
          <div className="hub-stat" data-accent="green">
            <p className="hub-stat__label">Em curso</p>
            <p className="hub-stat__value">{stats.emCurso}</p>
            <p className="hub-stat__hint">Aceitos ou em andamento</p>
          </div>
          <div className="hub-stat" data-accent="blue">
            <p className="hub-stat__label">Encerrados</p>
            <p className="hub-stat__value">{stats.encerrados}</p>
            <p className="hub-stat__hint">Finalizados, cancelados ou recusados</p>
          </div>
          <div className="hub-stat" data-accent="purple">
            <p className="hub-stat__label">Total recebidos</p>
            <p className="hub-stat__value">{stats.total}</p>
            <p className="hub-stat__hint">Todos os pedidos onde é prestador</p>
          </div>
        </div>

        <section className="hub-list-page__panel" aria-labelledby="lista-pedidos">
          <div className="hub-list-page__panel-toolbar">
            <div className="hub-list-page__panel-head" id="lista-pedidos">
              <h2>Lista de pedidos</h2>
              <p>Filtrar por estado — não é a agenda; são pedidos de clientes para o seu perfil.</p>
            </div>
            <div className="hub-list-page__chips">
              {filterButtons.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`hub-list-page__chip${filter === key ? " hub-list-page__chip--active" : ""}`}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading && <div className="hub-list-page__muted">Carregando pedidos…</div>}
          {error && !loading && (
            <div className="hub-list-page__muted hub-list-page__muted--error">{error}</div>
          )}

          {!loading && !error && (
            <div className="hub-booking-list">
              {filtered.map((s) => {
                const { date, time } = formatWhen(s);
                const preco = Number(s.preco_acordado);
                const cliente = clienteNomes[s.user_id] ?? "Cliente";
                const busy = actingId === s.id;
                const responder = precisaRespostaPrestador(s);

                return (
                  <div key={s.id} className="hub-booking-row">
                    <div className="hub-booking-row__main">
                      <div className="hub-booking-row__head">
                        <div>
                          <h3 className="hub-booking-row__title">{s.titulo || "Pedido de serviço"}</h3>
                          <p className="hub-booking-row__sub">
                            De <strong>{cliente}</strong>
                            {s.categoria ? <> · {s.categoria}</> : null}
                          </p>
                        </div>
                        <span className={pillClassForStatus(s)}>{labelServicoStatus(s)}</span>
                      </div>
                      <div className="hub-booking-row__meta">
                        <span>📅 {date}</span>
                        <span>🕐 {time}</span>
                        {s.duracao ? <span>⏱️ {s.duracao}</span> : null}
                      </div>
                      {responder ? (
                        <div className="hub-booking-row__actions">
                          <button
                            type="button"
                            className="hub-list-page__btn hub-list-page__btn--primary"
                            disabled={busy}
                            onClick={() => void handleResponder(s.id, "aceito")}
                          >
                            {busy ? "A processar…" : "Aceitar"}
                          </button>
                          <button
                            type="button"
                            className="hub-list-page__btn hub-list-page__btn--danger"
                            disabled={busy}
                            onClick={() => void handleResponder(s.id, "recusado")}
                          >
                            Recusar
                          </button>
                          <Link
                            href={messagesWithServico(s.id)}
                            className="hub-list-page__btn hub-list-page__btn--secondary"
                          >
                            Mensagens
                          </Link>
                          <Link
                            href={contractDetailPath(s.id)}
                            className="hub-list-page__btn hub-list-page__btn--secondary"
                          >
                            Ver contrato
                          </Link>
                        </div>
                      ) : (
                        <div className="hub-booking-row__actions">
                          <Link
                            href={messagesWithServico(s.id)}
                            className="hub-list-page__btn hub-list-page__btn--secondary"
                          >
                            Mensagens
                          </Link>
                          <Link
                            href={contractDetailPath(s.id)}
                            className="hub-list-page__btn hub-list-page__btn--secondary"
                          >
                            Ver contrato
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="hub-booking-row__side">
                      <p className="hub-booking-row__price">
                        {Number.isFinite(preco)
                          ? preco.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="hub-list-page__state">
              <div className="hub-list-page__state-icon" aria-hidden>
                📬
              </div>
              <h3 className="hub-list-page__state-title">
                {filter === "pendentes"
                  ? "Nenhum pedido à espera de resposta"
                  : filter === "em_curso"
                    ? "Nenhum pedido em curso"
                    : filter === "encerrados"
                      ? "Nenhum pedido encerrado"
                      : "Ainda não recebeu pedidos"}
              </h3>
              <p className="hub-list-page__state-text">
                {filter === "pendentes"
                  ? "Quando um cliente solicitar um serviço para o seu perfil, o pedido aparece aqui para aceitar ou recusar."
                  : filter === "todos" && pedidos.length === 0
                    ? "Os pedidos surgem quando clientes o escolhem no catálogo ou na demanda. Confirme que tem perfil de prestador ativo."
                    : "Experimente outro filtro ou veja o histórico de serviços concluídos."}
              </p>
              <div className="hub-list-page__state-actions">
                <button
                  type="button"
                  className="hub-list-page__btn hub-list-page__btn--primary"
                  onClick={() => router.push(ROUTES.hub)}
                >
                  Ir para o hub
                </button>
                <button
                  type="button"
                  className="hub-list-page__btn hub-list-page__btn--secondary"
                  onClick={() => router.push(ROUTES.explore)}
                >
                  Explorar catálogo
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
