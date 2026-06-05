"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MvpShell } from "@/components/MvpShell";
import { useExplore } from "@/utils/hooks/useExplore";

export default function ExplorePage() {
  const router = useRouter();
  const { categorias, loading, error, refetch } = useExplore();
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("all");
  const [minScore, setMinScore] = useState(0);

  const filtradas = useMemo(() => {
    return categorias
      .filter((c) => categoriaFiltro === "all" || c.categoria_id === categoriaFiltro)
      .map((cat) => ({
        ...cat,
        prestadores: cat.prestadores.filter((p) => {
          const termo = busca.toLowerCase();
          const matchBusca =
            !termo ||
            p.nome.toLowerCase().includes(termo) ||
            (p.cidade ?? "").toLowerCase().includes(termo) ||
            p.tags.some((t) => t.toLowerCase().includes(termo));
          const matchScore = (p.score ?? 0) >= minScore;
          return matchBusca && matchScore;
        }),
      }))
      .filter((c) => c.prestadores.length > 0);
  }, [categorias, busca, categoriaFiltro, minScore]);

  return (
    <MvpShell backHref="/">
      <main className="mvp-main">
        <h1 className="mvp-title">Explorar prestadores</h1>
        <p className="mvp-subtitle">
          Encontre profissionais por categoria, local e avaliação.
        </p>
        {!loading && !error && categorias.length > 0 ? (
          <p className="mvp-subtitle" style={{ marginTop: "-0.5rem", opacity: 0.85 }}>
            {categorias.reduce((n, c) => n + c.prestadores.length, 0)} profissionais
            em {categorias.length} categorias.
          </p>
        ) : null}

        <div className="mvp-filters">
          <input
            type="search"
            className="mvp-input"
            placeholder="Nome, cidade ou especialidade…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar prestadores"
          />
          <select
            className="mvp-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            aria-label="Filtrar por categoria"
          >
            <option value="all">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.categoria_id} value={c.categoria_id}>
                {c.categoria}
              </option>
            ))}
          </select>
          <select
            className="mvp-select mvp-select--narrow"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            aria-label="Filtrar por avaliação mínima"
          >
            <option value={0}>Qualquer avaliação</option>
            <option value={40}>Score 40+</option>
            <option value={45}>Score 45+</option>
            <option value={48}>Score 48+</option>
          </select>
          <button
            type="button"
            className="mvp-btn mvp-btn--ghost"
            onClick={() => void refetch()}
            disabled={loading}
          >
            Atualizar
          </button>
        </div>

        {loading && <p className="mvp-subtitle">Carregando…</p>}
        {error && (
          <div className="mvp-alert mvp-alert--error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && filtradas.length === 0 && (
          <p className="mvp-subtitle">Nenhum prestador com os filtros atuais.</p>
        )}

        {filtradas.map((cat) => (
          <section key={cat.categoria_id} className="mvp-explore-section">
            <h2 className="mvp-section-title">{cat.categoria}</h2>
            <div className="mvp-grid-cards">
              {cat.prestadores.map((p) => {
                const firstImg = p.portfolio?.find((x) => x.tipo !== "video");
                const avatarSrc = firstImg
                  ? `${apiBase}${firstImg.url}`
                  : p.foto_url || "/images/fotoPerfil.svg";
                const avatarUnopt =
                  avatarSrc.startsWith("http://") ||
                  avatarSrc.startsWith("https://");

                return (
                <article
                  key={p.user_id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/prestador/${p.user_id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/prestador/${p.user_id}`);
                    }
                  }}
                  className="mvp-card mvp-card-clickable mvp-card-prestador"
                >
                  <div className="mvp-card-prestador__row">
                    <Image
                      src={avatarSrc}
                      alt=""
                      width={56}
                      height={56}
                      sizes="56px"
                      unoptimized={avatarUnopt}
                      className="mvp-card-prestador__avatar"
                    />
                    <div className="mvp-card-prestador__body">
                      <h3 className="mvp-card-prestador__name">{p.nome}</h3>
                      <p className="mvp-card-prestador__meta">
                        {p.cidade ? `${p.cidade}, ${p.estado}` : "Local não informado"}
                      </p>
                      <p className="mvp-card-prestador__score">⭐ {p.score}</p>
                      {(p.portfolio?.length ?? 0) > 0 ? (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "#666",
                            margin: "0.25rem 0 0",
                          }}
                        >
                          {p.portfolio.length} trabalho
                          {p.portfolio.length === 1 ? "" : "s"} no portfólio
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {p.tags.length > 0 ? (
                    <div className="mvp-card-prestador__tags">
                      {p.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="mvp-card-prestador__tag" title={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </MvpShell>
  );
}
