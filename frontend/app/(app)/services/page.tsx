"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { ROUTES } from "@/lib/routes";
import type { Servico } from "@/types/entities/servico";
import { isServicoAtivo } from "@/lib/utils/servicoUi";
import "../shared/hub-list-page.css";

const CATEGORY_ICONS: Record<string, string> = {
  Cabelo: "✂️",
  Unhas: "💅",
  Barba: "🪒",
  Limpeza: "🧹",
  Encanador: "🔧",
  "Manutenção Elétrica": "⚡",
  "TI e Suporte": "💻",
  "Aulas Particulares": "📚",
  "Beleza e Estética": "💄",
};

export default function ServicesPage() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const uid = getCurrentUserId();
    if (!uid) {
      setLoading(false);
      setError("Inicie sessão para ver os seus serviços como profissional.");
      return;
    }
    (async () => {
      try {
        const lista = await ClientGateway.getServicosPorPrestador(uid);
        setServicos(lista);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Erro ao carregar serviços.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statsLocal = useMemo(() => {
    const ativos = servicos.filter(isServicoAtivo).length;
    const avaliacoes = servicos.reduce((acc, s) => acc + (s.total_avaliacoes ?? 0), 0);
    const notas = servicos
      .map((s) => s.nota)
      .filter((n): n is number => n != null && !Number.isNaN(Number(n)));
    const media =
      notas.length > 0
        ? (notas.reduce((a, b) => a + Number(b), 0) / notas.length).toFixed(1)
        : null;
    const receita = servicos.reduce((acc, s) => acc + (Number(s.preco_acordado) || 0), 0);
    return { ativos, avaliacoes, media, receita };
  }, [servicos]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(servicos.map((s) => s.categoria).filter(Boolean)))],
    [servicos],
  );

  const filtered =
    categoryFilter === "all"
      ? servicos
      : servicos.filter((s) => s.categoria === categoryFilter);

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
          <div className="hub-list-page__hero-row">
            <div>
              <h1 className="hub-list-page__title">Meus serviços</h1>
              <p className="hub-list-page__desc">
                Contratos em que figura como prestador — dados da plataforma DOMI.
              </p>
            </div>
            <div className="hub-list-page__btn-row">
              <button
                type="button"
                className="hub-list-page__btn hub-list-page__btn--primary"
                onClick={() => router.push(ROUTES.demand)}
              >
                Nova demanda
              </button>
            </div>
          </div>
        </header>

        <div className="hub-list-page__stats">
          <div className="hub-stat" data-accent="blue">
            <p className="hub-stat__label">Ativos</p>
            <p className="hub-stat__value">{statsLocal.ativos}</p>
            <p className="hub-stat__hint">Exclui cancelados, finalizados e recusados</p>
          </div>
          <div className="hub-stat" data-accent="green">
            <p className="hub-stat__label">Total na lista</p>
            <p className="hub-stat__value">{servicos.length}</p>
            <p className="hub-stat__hint">Como prestador</p>
          </div>
          <div className="hub-stat" data-accent="purple">
            <p className="hub-stat__label">Soma valores</p>
            <p className="hub-stat__value">
              {statsLocal.receita > 0
                ? statsLocal.receita.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "—"}
            </p>
            <p className="hub-stat__hint">Preço acordado dos itens listados</p>
          </div>
          <div className="hub-stat" data-accent="yellow">
            <p className="hub-stat__label">Avaliação média</p>
            <p className="hub-stat__value">
              {statsLocal.media ? statsLocal.media.replace(".", ",") : "—"}
            </p>
            <p className="hub-stat__hint">
              {statsLocal.avaliacoes > 0
                ? `⭐ ${statsLocal.avaliacoes} avaliações nos serviços`
                : "Sem notas agregadas"}
            </p>
          </div>
        </div>

        <section className="hub-list-page__panel" aria-labelledby="catalogo-servicos">
          <div className="hub-list-page__panel-toolbar">
            <div className="hub-list-page__panel-head" id="catalogo-servicos">
              <h2>Catálogo</h2>
              <p>Filtrar por categoria registada no serviço</p>
            </div>
            <div className="hub-list-page__chips">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`hub-list-page__chip${categoryFilter === category ? " hub-list-page__chip--active" : ""}`}
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === "all" ? "Todos" : category}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="hub-list-page__muted">Carregando serviços…</div>
          )}

          {error && (
            <div className="hub-list-page__muted hub-list-page__muted--error">{error}</div>
          )}

          {!loading && !error && (
            <div className="hub-service-grid">
              {filtered.map((servico) => (
                <article key={servico.id} className="hub-service-card">
                  <div className="hub-service-card__media" aria-hidden>
                    {servico.imagem ?? CATEGORY_ICONS[servico.categoria] ?? "🛠️"}
                  </div>

                  <div className="hub-service-card__body">
                    <div className="hub-service-card__top">
                      <div>
                        <h3 className="hub-service-card__title">{servico.titulo}</h3>
                        {servico.descricao ? (
                          <p className="hub-service-card__desc">{servico.descricao}</p>
                        ) : null}
                      </div>
                      <span
                        className={`hub-service-card__badge ${
                          isServicoAtivo(servico)
                            ? "hub-service-card__badge--on"
                            : "hub-service-card__badge--off"
                        }`}
                      >
                        {isServicoAtivo(servico) ? "Ativo" : "Encerrado"}
                      </span>
                    </div>

                    <div className="hub-service-card__meta">
                      <div>
                        <p className="hub-service-card__price">
                          {Number(servico.preco_acordado || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                        {servico.duracao ? (
                          <p className="hub-service-card__dur">{servico.duracao}</p>
                        ) : null}
                      </div>
                      <div className="hub-service-card__rating">
                        {servico.nota != null ? (
                          <>
                            <span aria-hidden>⭐</span>{" "}
                            <strong>{servico.nota}</strong>
                            {servico.total_avaliacoes != null ? (
                              <span> ({servico.total_avaliacoes})</span>
                            ) : null}
                          </>
                        ) : (
                          <span>Sem avaliação</span>
                        )}
                      </div>
                    </div>

                    <div className="hub-service-card__actions">
                      <button
                        type="button"
                        className="hub-list-page__btn hub-list-page__btn--secondary"
                        onClick={() => router.push(ROUTES.contracts)}
                      >
                        Ver nos contratos
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="hub-list-page__state">
              <div className="hub-list-page__state-icon" aria-hidden>
                🔍
              </div>
              <h3 className="hub-list-page__state-title">Nenhum serviço encontrado</h3>
              <p className="hub-list-page__state-text">
                {categoryFilter === "all"
                  ? "Ainda não há serviços em que figure como prestador."
                  : `Nenhum serviço na categoria «${categoryFilter}».`}
              </p>
              <div className="hub-list-page__state-actions">
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
