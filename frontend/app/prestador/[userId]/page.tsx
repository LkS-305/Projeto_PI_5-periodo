"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MvpShell } from "@/components/MvpShell";
import { useSession } from "@/lib/contexts/AuthContext";
import { usePrestador } from "@/utils/hooks/usePrestador";
import { usePortfolio } from "@/utils/hooks/usePortfolio";
import { Prestador } from "@/types/entities/prestador";
import { Categoria } from "@/types/entities/categoria";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";

export default function PrestadorPerfilPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { isAuthenticated, loading: sessionLoading } = useSession();
  const { fetchByUserId, loading: prestLoading, error: prestError } =
    usePrestador();
  const {
    items: portfolio,
    loading: portLoading,
    error: portError,
  } = usePortfolio(userId || undefined);

  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    void fetchByUserId(userId).then(setPrestador);
  }, [userId, fetchByUserId]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!userId) {
        setCatLoading(false);
        return;
      }
      setCatLoading(true);
      setCatError(null);
      try {
        const list = await PrestadorGateway.listCategoriasPorPrestador(userId);
        if (!cancelled) setCategorias(list);
      } catch {
        if (!cancelled) {
          setCategorias([]);
          setCatError("Não foi possível carregar as categorias.");
        }
      } finally {
        if (!cancelled) setCatLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
  const loading = prestLoading || portLoading;
  const errorMsg = prestError || portError;

  if (loading) {
    return (
      <MvpShell backHref="/explore">
        <main className="mvp-main">
          <p className="mvp-subtitle">Carregando perfil…</p>
        </main>
      </MvpShell>
    );
  }

  if (errorMsg || !prestador) {
    return (
      <MvpShell backHref="/explore">
        <main className="mvp-main mvp-main--narrow">
          <div className="mvp-alert mvp-alert--error" role="alert">
            {errorMsg ?? "Prestador não encontrado."}
          </div>
          <button
            type="button"
            className="mvp-btn"
            onClick={() => router.push("/explore")}
          >
            ← Voltar ao explorar
          </button>
        </main>
      </MvpShell>
    );
  }

  const fotoSrc = prestador.foto_url || "/images/fotoPerfil.svg";
  const isExternalFoto =
    fotoSrc.startsWith("http://") || fotoSrc.startsWith("https://");

  return (
    <MvpShell backHref="/explore">
      <main className="mvp-main">
        {!sessionLoading && !isAuthenticated ? (
          <p className="mvp-subtitle" style={{ marginBottom: "1rem" }}>
            <Link href="/login" className="mvp-nav-link" prefetch={false}>
              Entre
            </Link>{" "}
            para agendar um serviço com este profissional.
          </p>
        ) : null}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <Image
            src={fotoSrc}
            alt=""
            width={100}
            height={100}
            unoptimized={isExternalFoto}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ flex: "1 1 220px", minWidth: 0 }}>
            <h1 className="mvp-title" style={{ marginBottom: "0.25rem" }}>
              {prestador.nome}
            </h1>
            <p style={{ color: "var(--mvp-gold)", margin: "0 0 0.5rem" }}>
              ⭐ Score {prestador.score}
            </p>
            {prestador.status_verificacao ? (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.65rem",
                  background: "#e8f5e9",
                  borderRadius: 999,
                  fontSize: "0.8rem",
                  color: "#2e7d32",
                }}
              >
                {prestador.status_verificacao === "aprovado"
                  ? "Verificado"
                  : prestador.status_verificacao}
              </span>
            ) : null}
          </div>
        </div>

        <section className="mvp-card" style={{ marginBottom: "1rem" }}>
          <h2 className="mvp-section-title">Sobre</h2>
          <p style={{ color: "#444", lineHeight: 1.6, margin: 0 }}>
            {prestador.bio || "Sem descrição."}
          </p>
        </section>

        <section className="mvp-card" style={{ marginBottom: "1rem" }}>
          <h2 className="mvp-section-title">Categorias</h2>
          {catLoading ? (
            <p className="mvp-subtitle" style={{ margin: 0 }}>
              A carregar categorias…
            </p>
          ) : catError ? (
            <p className="mvp-subtitle" style={{ margin: 0, color: "#c0392b" }}>
              {catError}
            </p>
          ) : categorias.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>Nenhuma categoria associada.</p>
          ) : (
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.25rem",
                color: "#333",
                lineHeight: 1.7,
              }}
            >
              {categorias.map((c) => (
                <li key={c.id}>{c.nome}</li>
              ))}
            </ul>
          )}
        </section>

        {portfolio.length > 0 && (
          <section className="mvp-card" style={{ marginBottom: "5rem" }}>
            <h2 className="mvp-section-title">Portfolio</h2>
            <div className="mvp-grid-cards">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-[10px] bg-[#eee]"
                  style={{ aspectRatio: "1" }}
                >
                  {item.tipo === "video" ? (
                    <video
                      src={`${apiBase}${item.url}`}
                      className="h-full w-full object-cover"
                      controls
                      muted
                    />
                  ) : (
                    <Image
                      src={`${apiBase}${item.url}`}
                      alt={item.descricao ?? "Portfolio"}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <button
          type="button"
          className="mvp-fab"
          onClick={() => {
            if (!sessionLoading && !isAuthenticated) {
              router.push(`/login?redirect=${encodeURIComponent(`/prestador/${userId}`)}`);
              return;
            }
            router.push(
              `/servicos/agendar?prestador=${encodeURIComponent(userId)}`,
            );
          }}
        >
          Agendar serviço
        </button>
      </main>
    </MvpShell>
  );
}
