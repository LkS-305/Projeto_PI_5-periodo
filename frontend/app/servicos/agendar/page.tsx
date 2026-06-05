"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";
import { useServico } from "@/utils/hooks/useServico";
import { useCategoria } from "@/utils/hooks/useCategoria";
import { MvpShell } from "@/components/MvpShell";
import { Categoria } from "@/types/entities/categoria";
import { PrioridadeServico } from "@/types/dtos/servico";
import { Prestador } from "@/types/entities/prestador";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import Image from "next/image";

function AgendarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prestadorId = searchParams.get("prestador") ?? "";
  const { user } = useSession();
  const { abrirServico, loading, error } = useServico();
  const { fetchAll } = useCategoria();

  const [titulo, setTitulo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [prioridade, setPrioridade] = useState<PrioridadeServico>("media");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [catsLoading, setCatsLoading] = useState(true);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [prestadorLoading, setPrestadorLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setCatsLoading(true);
      const list = await fetchAll();
      if (alive && list) setCategorias(list);
      if (alive) setCatsLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [fetchAll]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!prestadorId.trim()) {
        setPrestador(null);
        return;
      }
      setPrestadorLoading(true);
      try {
        const p = await PrestadorGateway.getByUserId(prestadorId.trim());
        if (!cancelled) setPrestador(p);
      } catch {
        if (!cancelled) setPrestador(null);
      } finally {
        if (!cancelled) setPrestadorLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [prestadorId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!user?.id) {
      setLocalError("Faça login para agendar um serviço.");
      return;
    }
    if (!prestadorId) {
      setLocalError("Prestador não informado. Volte pelo perfil e clique em Agendar.");
      return;
    }
    if (!titulo.trim() || !categoriaId) {
      setLocalError("Preencha o nome e a categoria do serviço.");
      return;
    }

    const categoriaNome = categorias.find((c) => c.id === categoriaId)?.nome ?? "";

    const servico = await abrirServico({
      user_id: user.id,
      prestador_id: prestadorId,
      categoria_id: categoriaId,
      titulo: titulo.trim(),
      prioridade,
      categoria: categoriaNome,
    });

    if (servico?.id) {
      router.push(`/messages?servico=${servico.id}`);
    }
  }

  return (
    <MvpShell backHref={prestadorId ? `/prestador/${prestadorId}` : "/explore"}>
      <main className="mvp-main mvp-main--narrow">
        <h1 className="mvp-title">Agendar serviço</h1>
        <p className="mvp-subtitle">
          Descreva o que precisa. O prestador analisa e conversa consigo no chat.
        </p>

        {prestadorId ? (
          <section
            className="mvp-card"
            style={{
              marginBottom: "1rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {prestadorLoading ? (
              <p className="mvp-subtitle" style={{ margin: 0 }}>
                A carregar dados do prestador…
              </p>
            ) : prestador ? (
              <>
                <Image
                  src={prestador.foto_url || "/images/fotoPerfil.svg"}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized={
                    !!prestador.foto_url?.startsWith("http://") ||
                    !!prestador.foto_url?.startsWith("https://")
                  }
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem" }}>
                    {prestador.nome}
                  </p>
                  <p style={{ margin: "0.25rem 0 0", color: "var(--mvp-gold)" }}>
                    ⭐ {prestador.score}
                  </p>
                  {prestador.bio ? (
                    <p
                      style={{
                        margin: "0.5rem 0 0",
                        fontSize: "0.85rem",
                        color: "#555",
                        lineHeight: 1.45,
                      }}
                    >
                      {prestador.bio.length > 180
                        ? `${prestador.bio.slice(0, 177)}…`
                        : prestador.bio}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
              <p className="mvp-subtitle" style={{ margin: 0, color: "#a67c00" }}>
                Não foi possível carregar o perfil deste prestador (id:{" "}
                {prestadorId.slice(0, 12)}…).
              </p>
            )}
          </section>
        ) : null}

        <form className="mvp-card" onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span
              style={{
                display: "block",
                marginBottom: "0.35rem",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Nome do serviço
            </span>
            <input
              type="text"
              className="mvp-input"
              style={{ width: "100%" }}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Reparo de cano na cozinha"
              required
            />
          </label>

          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span
              style={{
                display: "block",
                marginBottom: "0.35rem",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Categoria
            </span>
            <select
              className="mvp-select"
              style={{ width: "100%" }}
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              disabled={catsLoading}
              required
            >
              <option value="">{catsLoading ? "Carregando…" : "Selecione…"}</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "block", marginBottom: "1.25rem" }}>
            <span
              style={{
                display: "block",
                marginBottom: "0.35rem",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Prioridade
            </span>
            <select
              className="mvp-select"
              style={{ width: "100%" }}
              value={prioridade}
              onChange={(e) =>
                setPrioridade(e.target.value as PrioridadeServico)
              }
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </label>

          {(localError || error) && (
            <div className="mvp-alert mvp-alert--error" style={{ marginTop: 0 }}>
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            className="mvp-btn mvp-btn--primary"
            style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
            disabled={loading || catsLoading}
          >
            {loading ? "A enviar…" : "Confirmar e abrir chat"}
          </button>
        </form>
      </main>
    </MvpShell>
  );
}

export default function AgendarServicoPage() {
  return (
    <Suspense
      fallback={
        <MvpShell>
          <main className="mvp-main">
            <p className="mvp-subtitle">A carregar…</p>
          </main>
        </MvpShell>
      }
    >
      <AgendarForm />
    </Suspense>
  );
}
