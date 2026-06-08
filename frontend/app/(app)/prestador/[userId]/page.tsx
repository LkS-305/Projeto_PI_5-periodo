"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ClientGateway,
  getAuthToken,
  getCurrentUserId,
} from "@/lib/gateways/ClientGateway";
import type { PortfolioItem } from "@/lib/gateways/ClientGateway";
import type { Prestador } from "@/types/entities/prestador";
import { ROUTES } from "@/lib/routes";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function resolveAsset(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

function PrestadorPerfilContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = typeof params.userId === "string" ? params.userId : "";

  const snapshot = useMemo(
    () => ({
      nome: searchParams.get("nome") ?? "Profissional",
      categoria: searchParams.get("categoria") ?? "",
      categoria_id: searchParams.get("categoria_id") ?? "",
      score: parseFloat(searchParams.get("score") ?? "0") || 0,
      tags: (searchParams.get("tags") ?? "")
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean),
      foto: searchParams.get("foto") ?? "",
    }),
    [searchParams],
  );

  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [duracao, setDuracao] = useState("");
  const [preco, setPreco] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const loggedIn = !!getAuthToken();
  const nomeExibicao = prestador?.nome ?? snapshot.nome;
  const bioExibicao = prestador?.bio?.trim() || "";
  const scoreExibicao = Number(prestador?.score ?? snapshot.score) || 0;
  const fotoHero = resolveAsset(prestador?.foto_url) ?? resolveAsset(snapshot.foto);
  const categoriaId = snapshot.categoria_id;
  const categoriaNome = snapshot.categoria || "Serviço";

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [items] = await Promise.all([
          ClientGateway.getPortfolio(userId),
          (async () => {
            if (!getAuthToken()) return;
            try {
              const p = await ClientGateway.getPrestador(userId);
              if (!cancelled) setPrestador(p);
            } catch {
              /* perfil público continua com snapshot */
            }
          })(),
        ]);
        if (!cancelled) setPortfolio(items ?? []);
      } catch (e: unknown) {
        if (!cancelled)
          setLoadError(
            e instanceof Error ? e.message : "Não foi possível carregar o perfil.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const tagsExibicao =
    snapshot.tags.length > 0 ? snapshot.tags : [];

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);
    const uid = getCurrentUserId();
    if (!uid) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/prestador/${userId}?${searchParams.toString()}`)}`,
      );
      return;
    }
    if (!categoriaId) {
      setFormError("Categoria não identificada. Volte ao explore e abra o perfil pelo card.");
      return;
    }
    if (!titulo.trim()) {
      setFormError("Informe o título do serviço.");
      return;
    }
    if (!dataInicio) {
      setFormError("Informe a data de início.");
      return;
    }
    if (!duracao.trim()) {
      setFormError("Informe a duração estimada.");
      return;
    }
    setSubmitting(true);
    try {
      await ClientGateway.createServico({
        user_id: uid,
        prestador_id: userId,
        categoria_id: categoriaId,
        categoria: categoriaNome,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        preco_acordado: preco ? parseFloat(preco.replace(",", ".")) : 0,
        data_inicio: new Date(dataInicio).toISOString(),
        duracao: duracao.trim(),
      });
      setFormSuccess(true);
      setTitulo("");
      setDescricao("");
      setDataInicio("");
      setDuracao("");
      setPreco("");
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "Erro ao criar serviço.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const loginHref = `/login?redirect=${encodeURIComponent(`/prestador/${userId}?${searchParams.toString()}`)}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF9F5",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        color: "#272727",
      }}
    >
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(20px, 4vw, 48px) clamp(16px, 4vw, 32px) 80px",
        }}
      >
        <p style={{ margin: "0 0 clamp(16px, 3vw, 24px)" }}>
          <Link
            href={ROUTES.explore}
            prefetch={false}
            style={{
              fontSize: "clamp(16px, 2.2vw, 20px)",
              fontWeight: 600,
              color: "#272727",
              textDecoration: "none",
            }}
          >
            ← Voltar ao explore
          </Link>
        </p>
        {loading ? (
          <p style={{ fontSize: "22px", color: "#8E8D8C" }}>Carregando perfil…</p>
        ) : loadError ? (
          <p style={{ fontSize: "22px", color: "#D92B2E" }}>{loadError}</p>
        ) : (
          <>
            <section
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "clamp(20px, 4vw, 32px)",
                alignItems: "flex-start",
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 24,
                  overflow: "hidden",
                  background: "#EAEAEA",
                  flexShrink: 0,
                  border: "3px solid #E0C271",
                }}
              >
                {fotoHero ? (
                  <Image
                    src={fotoHero}
                    alt=""
                    width={120}
                    height={120}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <Image
                    src="/images/profile_explore.svg"
                    alt=""
                    width={120}
                    height={120}
                  />
                )}
              </div>
              <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "clamp(28px, 5vw, 40px)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                  }}
                >
                  {nomeExibicao}
                </h1>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "clamp(16px, 2.5vw, 22px)",
                    color: "#535353",
                  }}
                >
                  {categoriaNome}
                  {scoreExibicao > 0 && (
                    <>
                      {" "}
                      · {scoreExibicao.toFixed(1)}{" "}
                      <Image
                        src="/images/review.svg"
                        alt=""
                        width={16}
                        height={16}
                        style={{ verticalAlign: "middle" }}
                      />
                    </>
                  )}
                </p>
                {tagsExibicao.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 14,
                    }}
                  >
                    {tagsExibicao.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "6px 14px",
                          background: "#8E8D8C",
                          borderRadius: 20,
                          fontSize: 15,
                          color: "#FAF9F5",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {bioExibicao ? (
              <section style={{ marginBottom: 36 }}>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 12,
                    color: "#272727",
                  }}
                >
                  Sobre
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    lineHeight: 1.55,
                    color: "#535353",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {bioExibicao}
                </p>
              </section>
            ) : null}

            <section style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 16,
                  color: "#272727",
                }}
              >
                Portfólio
              </h2>
              {portfolio.length === 0 ? (
                <p style={{ color: "#8E8D8C", fontSize: 18 }}>
                  Nenhum item de portfólio público ainda.
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                    gap: 14,
                  }}
                >
                  {portfolio.map((item) => {
                    const src = resolveAsset(item.url);
                    const isVideo = item.tipo === "video";
                    return (
                      <div
                        key={item.id}
                        style={{
                          aspectRatio: "3/4",
                          borderRadius: 16,
                          overflow: "hidden",
                          background: "#535353",
                          position: "relative",
                        }}
                      >
                        {src && isVideo ? (
                          <video
                            src={src}
                            controls
                            playsInline
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        ) : src ? (
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="200px"
                            style={{ objectFit: "cover" }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section
              style={{
                border: "2px solid #E0C271",
                borderRadius: 24,
                padding: "clamp(20px, 4vw, 32px)",
                background: "#FFFFFF",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "clamp(22px, 3.5vw, 28px)",
                  fontWeight: 700,
                }}
              >
                Agendar serviço
              </h2>
              <p style={{ margin: "0 0 24px", color: "#535353", fontSize: 16 }}>
                Preencha os dados do pedido. O prestador poderá ver na plataforma.
              </p>

              {!loggedIn ? (
                <p style={{ margin: 0, fontSize: 18 }}>
                  <Link
                    href={loginHref}
                    style={{
                      color: "#272727",
                      fontWeight: 700,
                      textDecoration: "underline",
                    }}
                  >
                    Faça login
                  </Link>{" "}
                  para enviar um pedido de serviço a este profissional.
                </p>
              ) : (
                <form onSubmit={handleAgendar}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 8,
                      fontSize: 15,
                    }}
                  >
                    Título *
                  </label>
                  <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex.: Pintura da sala"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1.5px solid #DEDEDE",
                      fontSize: 17,
                      marginBottom: 16,
                      boxSizing: "border-box",
                    }}
                  />
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 8,
                      fontSize: 15,
                    }}
                  >
                    Descrição
                  </label>
                  <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    rows={3}
                    placeholder="Detalhes do que você precisa"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1.5px solid #DEDEDE",
                      fontSize: 17,
                      marginBottom: 16,
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 8,
                          fontSize: 15,
                        }}
                      >
                        Início *
                      </label>
                      <input
                        type="datetime-local"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: "1.5px solid #DEDEDE",
                          fontSize: 16,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 600,
                          marginBottom: 8,
                          fontSize: 15,
                        }}
                      >
                        Duração *
                      </label>
                      <input
                        value={duracao}
                        onChange={(e) => setDuracao(e.target.value)}
                        placeholder="Ex.: 2 dias"
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          borderRadius: 12,
                          border: "1.5px solid #DEDEDE",
                          fontSize: 16,
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: 8,
                      fontSize: 15,
                    }}
                  >
                    Valor acordado (opcional)
                  </label>
                  <input
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="0"
                    inputMode="decimal"
                    style={{
                      width: "100%",
                      maxWidth: 220,
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: "1.5px solid #DEDEDE",
                      fontSize: 16,
                      marginBottom: 20,
                      boxSizing: "border-box",
                    }}
                  />
                  {formError ? (
                    <p style={{ color: "#D92B2E", margin: "0 0 12px" }}>
                      {formError}
                    </p>
                  ) : null}
                  {formSuccess ? (
                    <p style={{ color: "#2d7a4e", margin: "0 0 12px", fontWeight: 600 }}>
                      Pedido criado com sucesso.
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      maxWidth: 320,
                      padding: "16px 24px",
                      background: "#E0C271",
                      border: "none",
                      borderRadius: 16,
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#272727",
                      cursor: submitting ? "wait" : "pointer",
                      opacity: submitting ? 0.75 : 1,
                    }}
                  >
                    {submitting ? "Enviando…" : "Enviar pedido"}
                  </button>
                </form>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function PrestadorPerfilPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui",
          }}
        >
          Carregando…
        </div>
      }
    >
      <PrestadorPerfilContent />
    </Suspense>
  );
}
