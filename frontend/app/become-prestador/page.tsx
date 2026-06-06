"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClientGateway, getCurrentUserId, type Categoria } from "@/lib/gateways/ClientGateway";

const ICON_FALLBACK: Record<string, string> = {
  limpeza: "🧹",
  eletrica: "⚡",
  encanador: "🔧",
  aulas: "📚",
  beleza: "✂️",
  "ti-suporte": "💻",
};

export default function BecomePrestadorPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Allow page scroll (globals.css sets overflow: hidden on body/html)
  useEffect(() => {
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflowY = "";
    };
  }, []);

  // Pre-fill nome from usuario profile and load categories
  useEffect(() => {
    const userId = getCurrentUserId();
    if (userId) {
      ClientGateway.getUsuario(userId)
        .then((u) => { if (u?.nome) setNome(u.nome); })
        .catch(() => {});
    }
    ClientGateway.getCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]))
      .finally(() => setLoadingCats(false));
  }, []);

  const toggleCat = (id: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const bioLength = bio.trim().length;
  const bioValid = bioLength >= 10 && bioLength <= 500;
  const nomeValid = nome.trim().length >= 2;
  const canSubmit = nomeValid && bioValid && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);

    const userId = getCurrentUserId();
    if (!userId) {
      setError("Sessão expirada. Faça login novamente.");
      setSubmitting(false);
      return;
    }

    try {
      const prestador = await ClientGateway.createPrestador(nome.trim(), bio.trim());

      // Add selected categories (parallel, non-blocking)
      if (selectedCats.size > 0) {
        await Promise.allSettled(
          [...selectedCats].map((catId) =>
            ClientGateway.addCategoriaPrestador(prestador.user_id, catId),
          ),
        );
      }

      router.push("/home");
    } catch (err: any) {
      setError(err?.message || "Erro ao criar perfil. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <style>{`
        .bp-cat-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: clamp(8px, 0.7vw, 12px) clamp(14px, 1.4vw, 22px);
          border-radius: 999px;
          border: 2px solid #DEDEDE;
          background: transparent;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.8125rem, 1.1vw, 1.125rem);
          font-weight: 500;
          color: #535353;
          cursor: pointer;
          transition: all 0.18s ease;
          user-select: none;
          white-space: nowrap;
        }
        .bp-cat-chip:hover {
          border-color: #E0C271;
          color: #272727;
        }
        .bp-cat-chip--selected {
          border-color: #E0C271;
          background: rgba(224,194,113,0.15);
          color: #272727;
          font-weight: 600;
        }
        .bp-input {
          width: 100%;
          height: clamp(48px, 3.5vw, 64px);
          border: 2px solid #E0C271;
          border-radius: 999px;
          padding: 0 clamp(16px, 1.8vw, 28px);
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.2vw, 1.25rem);
          font-weight: 400;
          color: #272727;
          background: #FDFAF0;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .bp-input:focus { border-color: #C3A85E; }
        .bp-textarea {
          width: 100%;
          min-height: clamp(100px, 8vw, 140px);
          border: 2px solid #E0C271;
          border-radius: 20px;
          padding: clamp(12px, 1vw, 18px) clamp(16px, 1.8vw, 28px);
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.2vw, 1.25rem);
          font-weight: 400;
          color: #272727;
          background: #FDFAF0;
          outline: none;
          box-sizing: border-box;
          resize: vertical;
          line-height: 1.5;
          transition: border-color 0.2s;
        }
        .bp-textarea:focus { border-color: #C3A85E; }
        .bp-label {
          display: block;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.1vw, 1.125rem);
          font-weight: 600;
          color: #272727;
          margin-bottom: clamp(6px, 0.5vw, 10px);
        }
        .bp-hint {
          display: block;
          font-size: clamp(0.75rem, 0.9vw, 0.875rem);
          font-weight: 400;
          color: #8E8D8C;
          margin-top: 6px;
        }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          width: "100%",
          height: "clamp(60px, 5vw, 90px)",
          backgroundColor: "#E0C271",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "clamp(20px, 2.5vw, 40px)", transform: "translateY(-50%)", zIndex: 20 }}>
          <Image src="/images/logo_domi.svg" alt="Logo DOMI" width={60} height={51} style={{ display: "block" }} />
        </div>
        <span
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3.65vw, 4.375rem)",
            color: "#272727",
            lineHeight: 1,
            marginLeft: "clamp(90px, 8vw, 130px)",
            letterSpacing: "-1px",
            userSelect: "none",
          }}
        >
          DOMI
        </span>
        <button
          onClick={() => router.back()}
          style={{
            marginLeft: "auto",
            marginRight: "clamp(20px, 2.6vw, 50px)",
            border: "none",
            background: "transparent",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontSize: "clamp(0.875rem, 1.2vw, 1.25rem)",
            fontWeight: 500,
            color: "#272727",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ← Voltar
        </button>
      </header>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(760px, 92vw)",
          margin: "0 auto",
          padding: "clamp(32px, 4vw, 64px) clamp(16px, 2vw, 32px) clamp(48px, 6vw, 96px)",
          boxSizing: "border-box",
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "clamp(28px, 3vw, 48px)" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(224,194,113,0.18)",
              border: "1.5px solid #E0C271",
              borderRadius: "999px",
              padding: "5px 18px",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontSize: "clamp(0.75rem, 1vw, 1rem)",
              fontWeight: 500,
              color: "#C3A85E",
              marginBottom: "16px",
            }}
          >
            Modo Profissional
          </div>
          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)",
              color: "#272727",
              margin: "0 0 12px",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            Crie seu perfil profissional
          </h1>
          <p
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontSize: "clamp(0.875rem, 1.2vw, 1.25rem)",
              fontWeight: 400,
              color: "#535353",
              margin: 0,
              lineHeight: 1.55,
            }}
          >
            Apresente seus serviços, conquiste clientes e gerencie tudo pela DOMI.
            Leva menos de 2 minutos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.5vw, 32px)" }}>

          {/* Nome */}
          <div>
            <label className="bp-label">
              Nome profissional
            </label>
            <input
              className="bp-input"
              type="text"
              placeholder="Como seus clientes vão te conhecer"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={100}
              required
            />
            <span className="bp-hint">Mínimo 2 caracteres. Pode usar seu nome real ou nome fantasia.</span>
          </div>

          {/* Bio */}
          <div>
            <label className="bp-label">
              Apresentação / Bio
            </label>
            <textarea
              className="bp-textarea"
              placeholder="Ex: Eletricista com 8 anos de experiência em residências e comércio. Especializado em instalações e manutenção..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              required
            />
            <span
              className="bp-hint"
              style={{ color: bioLength > 0 && !bioValid ? "#D92B2E" : "#8E8D8C" }}
            >
              {bioLength}/500 caracteres{bioLength < 10 && bioLength > 0 ? ` · mínimo 10` : ""}
            </span>
          </div>

          {/* Categorias */}
          <div>
            <label className="bp-label">
              Especialidades
              <span style={{ fontWeight: 400, color: "#8E8D8C", marginLeft: 8 }}>
                (opcional, mas recomendado)
              </span>
            </label>
            {loadingCats ? (
              <p style={{ color: "#8E8D8C", fontSize: "clamp(0.8125rem, 1vw, 1rem)", margin: "8px 0 0" }}>
                Carregando categorias...
              </p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px, 0.8vw, 14px)", marginTop: "8px" }}>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCat(cat.id)}
                    className={`bp-cat-chip${selectedCats.has(cat.id) ? " bp-cat-chip--selected" : ""}`}
                  >
                    <span style={{ fontSize: "1.1em" }}>
                      {ICON_FALLBACK[cat.slug] ?? "🔹"}
                    </span>
                    {cat.nome}
                    {selectedCats.has(cat.id) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C3A85E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontSize: "clamp(0.8125rem, 1vw, 1rem)",
                fontWeight: 500,
                color: "#D92B2E",
                margin: 0,
                padding: "12px 18px",
                backgroundColor: "rgba(217,43,46,0.07)",
                borderRadius: "12px",
                border: "1px solid rgba(217,43,46,0.2)",
              }}
            >
              {error}
            </p>
          )}

          {/* Divider */}
          <div style={{ width: "100%", height: "1.5px", backgroundColor: "rgba(195,168,94,0.3)" }} />

          {/* Submit */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontSize: "clamp(0.75rem, 0.9vw, 0.9375rem)",
                fontWeight: 400,
                color: "#8E8D8C",
                margin: 0,
                maxWidth: "360px",
              }}
            >
              Você poderá editar seu perfil a qualquer momento nas configurações.
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "0 clamp(28px, 2.5vw, 44px)",
                height: "clamp(48px, 3.5vw, 64px)",
                borderRadius: "999px",
                border: "none",
                backgroundColor: canSubmit ? "#E0C271" : "#E8E8E8",
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontSize: "clamp(0.9375rem, 1.2vw, 1.25rem)",
                fontWeight: 600,
                color: canSubmit ? "#272727" : "#AAAAAA",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {submitting ? (
                "Criando perfil..."
              ) : (
                <>
                  Criar perfil profissional
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
