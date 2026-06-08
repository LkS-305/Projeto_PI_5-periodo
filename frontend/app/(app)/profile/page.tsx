"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { AvaliacaoGateway } from "@/lib/gateways/AvaliacaoGateway";
import type { Avaliacao } from "@/types/entities/avaliacao";
import type { Prestador } from "@/types/entities/prestador";
import type { Usuario } from "@/types/entities/usuario";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// Resolve URLs de foto vindas do backend (ex: /uploads/...) para URL absoluta
function resolveFoto(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileView = "contratante" | "profissional";

interface Review {
  id: string;
  author: string;
  authorRole: string;
  date: string;
  rating: number;
  comment: string;
}

function mapAvaliacaoToReview(
  a: Avaliacao,
  author: string,
  authorRole: string,
): Review {
  const raw = a.created_at as unknown as string | Date | undefined;
  const d = raw ? new Date(raw) : new Date();
  const dateStr = isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
  const comment = (a.comentario ?? "").trim();
  return {
    id: String(a.id),
    author,
    authorRole,
    date: dateStr,
    rating: Math.min(5, Math.max(0, Number(a.nota) || 0)),
    comment: comment || "Sem comentário.",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function formatMemberSince(raw: Date | string | undefined | null): string {
  if (raw == null) return "—";
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
}

function asAvaliacaoList(data: unknown): Avaliacao[] {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is Avaliacao => item != null && typeof item === "object" && "id" in item && "nota" in item);
}

// ─── StarDisplay ──────────────────────────────────────────────────────────────

function StarDisplay({
  rating,
  count,
  size = 44,
}: {
  rating: number;
  count: number;
  size?: number;
}) {
  const full = Math.round(rating);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              fontSize: `${size}px`,
              color: i <= full ? "#E0C271" : "#DEDEDE",
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
      </div>
      <span
        style={{
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 600,
          fontSize: "70px",
          color: "#272727",
          lineHeight: 1,
          letterSpacing: "-1px",
        }}
      >
        {rating.toFixed(1).replace(".", ",")}
      </span>
      <span
        style={{
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "26px",
          color: "#8E8D8C",
        }}
      >
        {count} {count === 1 ? "avaliação" : "avaliações"}
      </span>
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        border: "1.5px solid #EAEAEA",
        borderRadius: "28px",
        padding: "30px 36px",
        boxSizing: "border-box",
        transition: "box-shadow 0.18s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Avatar */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#F0F0F0",
              border: "2px solid #EAEAEA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/profile_explore.svg"
              alt={review.author}
              width={52}
              height={52}
              style={{ display: "block" }}
            />
          </div>
          <div>
            <p style={{ ...SF, fontWeight: 600, fontSize: "26px", color: "#272727", margin: 0, lineHeight: 1.2 }}>
              {review.author}
            </p>
            <p style={{ ...SF, fontWeight: 400, fontSize: "22px", color: "#8E8D8C", margin: 0, marginTop: "3px" }}>
              {review.authorRole}
            </p>
          </div>
        </div>

        {/* Rating + date */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <div style={{ display: "flex", gap: "3px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} style={{ fontSize: "22px", color: i <= review.rating ? "#E0C271" : "#DEDEDE", lineHeight: 1 }}>
                ★
              </span>
            ))}
          </div>
          <span style={{ ...SF, fontSize: "20px", color: "#AAAAAA" }}>{review.date}</span>
        </div>
      </div>

      {/* Comment */}
      <p
        style={{
          ...SF,
          fontWeight: 400,
          fontSize: "24px",
          color: "#535353",
          margin: 0,
          lineHeight: 1.6,
          fontStyle: "italic",
        }}
      >
        "{review.comment}"
      </p>
    </div>
  );
}

// ─── StatBadge ────────────────────────────────────────────────────────────────

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "120px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {icon}
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "38px", color: "#272727", lineHeight: 1 }}>{value}</span>
      </div>
      <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "20px", color: "#8E8D8C", textAlign: "center" as const }}>{label}</span>
    </div>
  );
}

// ─── ProfileContratante ───────────────────────────────────────────────────────

function ProfileContratante({
  reviews,
  contratosCount,
  memberSinceLabel,
}: {
  reviews: Review[];
  contratosCount: number;
  memberSinceLabel: string;
}) {
  const rating = avg(reviews);
  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>

      {/* Stats bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0px" }}>
        <StatBadge
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
          value={String(contratosCount)}
          label="serviços (como cliente)"
        />
        <div style={{ width: "1.5px", height: "50px", backgroundColor: "#EAEAEA", margin: "0 40px" }} />
        <StatBadge
          icon={<span style={{ fontSize: "22px", color: "#E0C271" }}>★</span>}
          value={rating.toFixed(1).replace(".", ",")}
          label="avaliação média"
        />
        <div style={{ width: "1.5px", height: "50px", backgroundColor: "#EAEAEA", margin: "0 40px" }} />
        <StatBadge
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          value={memberSinceLabel}
          label="membro desde"
        />
      </div>

      {/* Rating section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ ...SF, fontWeight: 700, fontSize: "20px", color: "#8E8D8C", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
          Reputação como contratante
        </p>
        <StarDisplay rating={rating} count={reviews.length} size={48} />
      </div>

      {/* Divider */}
      <div style={{ height: "1.5px", backgroundColor: "#EAEAEA" }} />

      {/* Reviews */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
          <div style={{ width: "8px", height: "40px", backgroundColor: "#E0C271", borderRadius: "4px", flexShrink: 0 }} />
          <p style={{ ...SF, fontWeight: 700, fontSize: "36px", color: "#272727", margin: 0 }}>
            Avaliações recebidas
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.length === 0 ? (
            <p style={{ ...SF, fontSize: "22px", color: "#8E8D8C", textAlign: "center" }}>Ainda não há avaliações públicas.</p>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ProfileProfissional ──────────────────────────────────────────────────────

function ProfileProfissional({
  isPrestador,
  reviews,
  servicosCount,
  memberSinceLabel,
  tituloProfissional,
  tags,
}: {
  isPrestador: boolean;
  reviews: Review[];
  servicosCount: number;
  memberSinceLabel: string;
  tituloProfissional: string;
  tags: string[];
}) {
  const rating = avg(reviews);
  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  if (!isPrestador) {
    return (
      <div style={{ ...SF, textAlign: "center", padding: "48px 24px", backgroundColor: "#FFFFFF", border: "1.5px solid #EAEAEA", borderRadius: "28px" }}>
        <p style={{ fontSize: "28px", color: "#272727", margin: "0 0 16px" }}>Perfil profissional</p>
        <p style={{ fontSize: "22px", color: "#8E8D8C", margin: "0 0 28px", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
          Ative o modo prestador para aparecer no explore, receber demandas e gerir o portfólio.
        </p>
        <Link
          href={ROUTES.becomePrestador}
          style={{ display: "inline-block", padding: "14px 32px", borderRadius: "30px", backgroundColor: "#272727", color: "#FAF9F5", fontWeight: 600, fontSize: "22px", textDecoration: "none" }}
        >
          Tornar-me prestador
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>

      {/* Profissão + tags (categorias quando existirem) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
        <span style={{ ...SF, padding: "10px 28px", backgroundColor: "rgba(224,194,113,0.15)", border: "2px solid #E0C271", borderRadius: "50px", fontWeight: 600, fontSize: "28px", color: "#C3A85E" }}>
          {tituloProfissional}
        </span>
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            {tags.map((s) => (
              <span key={s} style={{ ...SF, padding: "6px 18px", backgroundColor: "#F0F0F0", borderRadius: "20px", fontSize: "22px", color: "#535353", border: "1.5px solid #EAEAEA" }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <StatBadge
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          value={String(servicosCount)}
          label="serviços"
        />
        <div style={{ width: "1.5px", height: "50px", backgroundColor: "#EAEAEA", margin: "0 40px" }} />
        <StatBadge
          icon={<span style={{ fontSize: "22px", color: "#E0C271" }}>★</span>}
          value={rating.toFixed(1).replace(".", ",")}
          label="avaliação média"
        />
        <div style={{ width: "1.5px", height: "50px", backgroundColor: "#EAEAEA", margin: "0 40px" }} />
        <StatBadge
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          value={memberSinceLabel}
          label="na plataforma"
        />
      </div>

      {/* Rating section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ ...SF, fontWeight: 700, fontSize: "20px", color: "#8E8D8C", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
          Reputação profissional
        </p>
        <StarDisplay rating={rating} count={reviews.length} size={48} />
      </div>

      {/* Divider */}
      <div style={{ height: "1.5px", backgroundColor: "#EAEAEA" }} />

      {/* Reviews from clients */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
          <div style={{ width: "8px", height: "40px", backgroundColor: "#E0C271", borderRadius: "4px", flexShrink: 0 }} />
          <p style={{ ...SF, fontWeight: 700, fontSize: "36px", color: "#272727", margin: 0 }}>
            Avaliações de clientes
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.length === 0 ? (
            <p style={{ ...SF, fontSize: "22px", color: "#8E8D8C", textAlign: "center" }}>Ainda não há avaliações públicas.</p>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} />)
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1.5px", backgroundColor: "#EAEAEA" }} />

      {/* Portfólio (rota real) */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "8px", height: "40px", backgroundColor: "#C3A85E", borderRadius: "4px", flexShrink: 0 }} />
            <p style={{ ...SF, fontWeight: 700, fontSize: "36px", color: "#272727", margin: 0 }}>
              Portfólio
            </p>
          </div>
          <Link
            href={ROUTES.portifolio}
            style={{ ...SF, padding: "12px 28px", borderRadius: "30px", border: "1.5px solid #E0C271", backgroundColor: "transparent", fontSize: "24px", color: "#C3A85E", fontWeight: 500, textDecoration: "none", display: "inline-block" }}
          >
            Gerir portfólio →
          </Link>
        </div>
        <p style={{ ...SF, fontSize: "22px", color: "#8E8D8C", margin: 0 }}>
          Fotos e vídeos do seu trabalho ficam na página de portfólio.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [view, setView] = useState<ProfileView>("contratante");

  const [nome, setNome] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [reviewsContratante, setReviewsContratante] = useState<Review[]>([]);
  const [reviewsProfissional, setReviewsProfissional] = useState<Review[]>([]);
  const [contratosComoCliente, setContratosComoCliente] = useState(0);
  const [servicosComoPrestador, setServicosComoPrestador] = useState(0);
  const [tagsPrestador, setTagsPrestador] = useState<string[]>([]);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;

    (async () => {
      let resolvedFoto: string | null = null;
      let prestadorLocal: Prestador | null = null;
      try {
        const u = await ClientGateway.getUsuario(userId);
        setUsuario(u);
        if (u?.nome) setNome(u.nome);
        if (u?.foto_url) {
          resolvedFoto = resolveFoto(u.foto_url);
          setFotoUrl(resolvedFoto);
        }
      } catch {
        /* mantém os valores padrão */
      }

      try {
        const p = await ClientGateway.getPrestador(userId);
        prestadorLocal = p;
        setPrestador(p);
        if (p?.bio) setBio(p.bio);
        if (!resolvedFoto && p?.foto_url) {
          resolvedFoto = resolveFoto(p.foto_url);
          setFotoUrl(resolvedFoto);
        }
      } catch {
        setPrestador(null);
      }

      try {
        const servicosCliente = await ClientGateway.getServicosPorUser(userId);
        setContratosComoCliente(servicosCliente.length);
      } catch {
        setContratosComoCliente(0);
      }

      try {
        const rawAv = await AvaliacaoGateway.getByUserId(userId);
        const list = asAvaliacaoList(rawAv);
        setReviewsContratante(
          list.map((a) => mapAvaliacaoToReview(a, "Profissional", "Prestador")),
        );
      } catch {
        setReviewsContratante([]);
      }

      try {
        if (!prestadorLocal) {
          setReviewsProfissional([]);
          setServicosComoPrestador(0);
          setTagsPrestador([]);
          return;
        }
        const [rawAvPrest, servicosPrest, explore] = await Promise.all([
          AvaliacaoGateway.getByPrestadorId(prestadorLocal.user_id),
          ClientGateway.getServicosPorPrestador(prestadorLocal.user_id),
          ClientGateway.getExplore().catch(() => [] as Awaited<ReturnType<typeof ClientGateway.getExplore>>),
        ]);
        const listPrest = asAvaliacaoList(rawAvPrest);
        setReviewsProfissional(
          listPrest.map((a) => mapAvaliacaoToReview(a, "Cliente", "Contratante")),
        );
        setServicosComoPrestador(servicosPrest.length);

        const card = explore.flatMap((c) => c.prestadores).find((x) => x.user_id === userId);
        setTagsPrestador(card?.tags?.length ? card.tags : []);
      } catch {
        setReviewsProfissional([]);
        setServicosComoPrestador(0);
        setTagsPrestador([]);
      }
    })();
  }, []);

  const avatarSrc = fotoUrl ?? "/images/profile.svg";
  const memberCliente = formatMemberSince(usuario?.created_at ?? null);
  const memberProf = formatMemberSince(prestador?.created_at ?? usuario?.created_at ?? null);
  const tituloProfissional = prestador?.nome?.trim() || "Profissional";

  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  return (
    <div
      className="profile-root"
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#FAF9F5",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
    >
      <style>{`
        /* Scrollbars */
        .profile-root::-webkit-scrollbar { width: 6px; }
        .profile-root::-webkit-scrollbar-track { background: rgba(39,39,39,0.08); border-radius: 3px; margin: 16px 0; }
        .profile-root::-webkit-scrollbar-thumb { background: rgba(195,168,94,0.45); border-radius: 3px; }
        .profile-root::-webkit-scrollbar-thumb:hover { background: rgba(195,168,94,0.75); }
        .profile-root { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.08); }
        .profile-media-scroll::-webkit-scrollbar { display: none; }
        .profile-media-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* View fade */
        @keyframes viewFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .view-content { animation: viewFade 0.3s ease forwards; }
      `}</style>

      {/* ── CONTEÚDO ──────────────────────────────────────────────────────────── */}
      <div style={{ paddingLeft: "105px", paddingRight: "105px", paddingTop: "50px", paddingBottom: "100px" }}>

        {/* Voltar */}
        <div
          onClick={() => router.back()}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "28px", fontWeight: 500, color: "#535353", cursor: "pointer", marginBottom: "50px", userSelect: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
        >
          ← Voltar
        </div>

        {/* ── HERO ────────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", marginBottom: "56px" }}>
          {/* Avatar with gold ring */}
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              border: "5px solid #E0C271",
              boxShadow: "0 0 0 6px rgba(224,194,113,0.18), 0 16px 48px rgba(0,0,0,0.14)",
              overflow: "hidden",
              backgroundColor: "#EAEAEA",
              flexShrink: 0,
            }}
          >
            <Image
              src={avatarSrc}
              alt="Foto de perfil"
              width={200}
              height={200}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Name + bio */}
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "72px", color: "#272727", margin: 0, lineHeight: 1.05, letterSpacing: "-1.5px" }}>
              {nome || "Usuário"}
            </h1>
            {bio && (
              <p style={{ ...SF, fontWeight: 400, fontSize: "28px", color: "#8E8D8C", margin: 0, marginTop: "8px", maxWidth: "640px" }}>
                {bio}
              </p>
            )}
          </div>

          {/* ── VIEW TOGGLE ── */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#F0F0F0",
              borderRadius: "50px",
              padding: "5px",
              gap: "4px",
              marginTop: "8px",
            }}
          >
            {(["contratante", "profissional"] as ProfileView[]).map((v) => {
              const active = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "14px 36px",
                    borderRadius: "50px",
                    border: "none",
                    backgroundColor: active ? "#272727" : "transparent",
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: active ? 600 : 400,
                    fontSize: "26px",
                    color: active ? "#FAF9F5" : "#8E8D8C",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.645,0.045,0.355,1)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {v === "contratante" ? "Contratante" : "Profissional"}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── VIEW CONTENT ─────────────────────────────────────────────────────── */}
        <div key={view} className="view-content">
          {view === "contratante" ? (
            <ProfileContratante
              reviews={reviewsContratante}
              contratosCount={contratosComoCliente}
              memberSinceLabel={memberCliente}
            />
          ) : (
            <ProfileProfissional
              isPrestador={!!prestador}
              reviews={reviewsProfissional}
              servicosCount={servicosComoPrestador}
              memberSinceLabel={memberProf}
              tituloProfissional={tituloProfissional}
              tags={tagsPrestador}
            />
          )}
        </div>
      </div>
    </div>
  );
}
