"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";

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

interface PinnedProject {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  tags: string[];
  photos: number;
  videos: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CLIENT_REVIEWS: Review[] = [
  {
    id: "cr1",
    author: "Rafael B.",
    authorRole: "Pintor",
    date: "Mai 2025",
    rating: 5,
    comment:
      "Excelente contratante. Pagamento pontual, comunicação clara e o ambiente estava bem preparado para o serviço. Recomendo fortemente.",
  },
  {
    id: "cr2",
    author: "Pedro H.",
    authorRole: "Encanador",
    date: "Abr 2025",
    rating: 4,
    comment:
      "Local organizado e fácil acesso ao ponto de trabalho. Contratante cordial e respeitoso. Experiência positiva.",
  },
  {
    id: "cr3",
    author: "Lucas F.",
    authorRole: "Eletricista",
    date: "Mar 2025",
    rating: 5,
    comment:
      "Muito atencioso, deixou o quadro de energia acessível e o ambiente limpo. Tornou o serviço muito mais ágil.",
  },
  {
    id: "cr4",
    author: "Sandra O.",
    authorRole: "Gesseira",
    date: "Jan 2025",
    rating: 5,
    comment:
      "Contratante exemplar. Aprovou as etapas com agilidade e pagou no prazo combinado. Uma das melhores experiências.",
  },
];

const PROFESSIONAL_REVIEWS: Review[] = [
  {
    id: "pr1",
    author: "Carla M.",
    authorRole: "Cliente",
    date: "Mai 2025",
    rating: 5,
    comment:
      "Trabalho impecável! O acabamento ficou muito além do esperado. Prazo cumprido à risca e postura extremamente profissional.",
  },
  {
    id: "pr2",
    author: "João P.",
    authorRole: "Cliente",
    date: "Abr 2025",
    rating: 5,
    comment:
      "Profissional de altíssimo nível. Explicou cada etapa do processo e manteve o ambiente limpo durante todo o serviço.",
  },
  {
    id: "pr3",
    author: "Ana R.",
    authorRole: "Cliente",
    date: "Abr 2025",
    rating: 4,
    comment:
      "Ótimo serviço e qualidade excelente. Houve um pequeno atraso no início, mas foi comunicado com antecedência e o resultado valeu.",
  },
  {
    id: "pr4",
    author: "Pedro S.",
    authorRole: "Cliente",
    date: "Mar 2025",
    rating: 5,
    comment:
      "O resultado superou todas as expectativas. A pintura ficou com um acabamento premium que valorizou muito o apartamento.",
  },
  {
    id: "pr5",
    author: "Fernanda O.",
    authorRole: "Cliente",
    date: "Fev 2025",
    rating: 5,
    comment:
      "Profissional exemplar em todos os sentidos. Já contratei novamente e pretendo continuar. Nota máxima sem hesitar.",
  },
];

const PINNED_PROJECTS: PinnedProject[] = [
  {
    id: 1,
    title: "Pintura de paredes — Apartamento Jardins",
    category: "Pintura",
    date: "Maio 2025",
    location: "São Paulo, SP",
    tags: ["Paredes", "Tetos", "Interior"],
    photos: 5,
    videos: 2,
  },
  {
    id: 2,
    title: "Fachada residencial — Vila Madalena",
    category: "Fachada",
    date: "Abril 2025",
    location: "São Paulo, SP",
    tags: ["Fachada", "Externo", "Anti-mofo"],
    photos: 4,
    videos: 2,
  },
  {
    id: 3,
    title: "Pintura de madeira — Deck externo",
    category: "Madeira",
    date: "Março 2025",
    location: "Guarujá, SP",
    tags: ["Madeira", "Verniz", "Externo"],
    photos: 4,
    videos: 3,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
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

// ─── PinnedProjectCard ────────────────────────────────────────────────────────

function PinnedProjectCard({ project }: { project: PinnedProject }) {
  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };
  const total = project.photos + project.videos;

  return (
    <div
      style={{
        flexShrink: 0,
        width: "520px",
        borderRadius: "32px",
        backgroundColor: "rgba(39,39,39,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "3px solid #C3A85E",
        boxShadow: "0 6px 32px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}
    >
      {/* Top: category + pin */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 26px 16px" }}>
        <span style={{ ...SF, padding: "5px 18px", backgroundColor: "rgba(224,194,113,0.18)", border: "1.5px solid #E0C271", borderRadius: "30px", fontWeight: 500, fontSize: "20px", color: "#E0C271" }}>
          {project.category}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "5px 14px", backgroundColor: "rgba(224,194,113,0.15)", border: "1.5px solid #E0C271", borderRadius: "30px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#E0C271">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
          <span style={{ ...SF, fontSize: "18px", fontWeight: 500, color: "#E0C271" }}>Destacado</span>
        </div>
      </div>

      {/* Media strip */}
      <div
        style={{ display: "flex", gap: "10px", overflowX: "auto", paddingLeft: "20px", paddingRight: "20px", paddingBottom: "4px", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        className="profile-media-scroll"
      >
        {Array.from({ length: Math.min(total, 5) }).map((_, i) => {
          const isVideo = i >= project.photos;
          return (
            <div key={i} style={{ flexShrink: 0, width: "95px", height: "130px", backgroundColor: "#535353", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image
                src={isVideo ? "/images/play.svg" : "/images/picture.svg"}
                alt={isVideo ? "Vídeo" : "Foto"}
                width={isVideo ? 34 : 40}
                height={34}
                style={{ display: "block", opacity: 0.8 }}
              />
            </div>
          );
        })}
        {total > 5 && (
          <div style={{ flexShrink: 0, width: "95px", height: "130px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ ...SF, fontSize: "22px", color: "#C8C7C5" }}>+{total - 5}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "16px 26px 22px" }}>
        <p style={{ ...SF, fontWeight: 600, fontSize: "24px", color: "#FAF9F5", margin: 0, lineHeight: 1.25, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
          {project.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
          <Image src="/images/location.svg" alt="local" width={13} height={16} />
          <span style={{ ...SF, fontSize: "18px", color: "#8E8D8C" }}>{project.location} · {project.date}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "nowrap", gap: "7px", overflow: "hidden" }}>
          {project.tags.map((t) => (
            <span key={t} style={{ ...SF, padding: "4px 12px", backgroundColor: "#4a4a4a", borderRadius: "16px", fontSize: "18px", color: "#C8C7C5", whiteSpace: "nowrap" as const }}>{t}</span>
          ))}
        </div>
      </div>
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

function ProfileContratante() {
  const rating = avg(CLIENT_REVIEWS);
  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>

      {/* Stats bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0px" }}>
        <StatBadge
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
          value="12"
          label="contratos"
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
          value="Jan 2024"
          label="membro desde"
        />
      </div>

      {/* Rating section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ ...SF, fontWeight: 700, fontSize: "20px", color: "#8E8D8C", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
          Reputação como contratante
        </p>
        <StarDisplay rating={rating} count={CLIENT_REVIEWS.length} size={48} />
      </div>

      {/* Divider */}
      <div style={{ height: "1.5px", backgroundColor: "#EAEAEA" }} />

      {/* Reviews */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
          <div style={{ width: "8px", height: "40px", backgroundColor: "#E0C271", borderRadius: "4px", flexShrink: 0 }} />
          <p style={{ ...SF, fontWeight: 700, fontSize: "36px", color: "#272727", margin: 0 }}>
            Avaliações de profissionais
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {CLIENT_REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ProfileProfissional ──────────────────────────────────────────────────────

function ProfileProfissional() {
  const rating = avg(PROFESSIONAL_REVIEWS);
  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  const specialties = ["Paredes", "Tetos", "Fachada", "Madeira", "Verniz"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>

      {/* Profissão + especialidades */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ ...SF, padding: "10px 28px", backgroundColor: "rgba(224,194,113,0.15)", border: "2px solid #E0C271", borderRadius: "50px", fontWeight: 600, fontSize: "28px", color: "#C3A85E" }}>
            Pintor(a)
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", backgroundColor: "#F4F4F4", borderRadius: "50px", border: "1.5px solid #DEDEDE" }}>
            <svg width="18" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span style={{ ...SF, fontSize: "26px", color: "#535353" }}>2,3 km de você</span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
          {specialties.map((s) => (
            <span key={s} style={{ ...SF, padding: "6px 18px", backgroundColor: "#F0F0F0", borderRadius: "20px", fontSize: "22px", color: "#535353", border: "1.5px solid #EAEAEA" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <StatBadge
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          value="89"
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
          value="Jan 2022"
          label="na plataforma"
        />
      </div>

      {/* Rating section */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <p style={{ ...SF, fontWeight: 700, fontSize: "20px", color: "#8E8D8C", textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
          Reputação profissional
        </p>
        <StarDisplay rating={rating} count={PROFESSIONAL_REVIEWS.length} size={48} />
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
          {PROFESSIONAL_REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1.5px", backgroundColor: "#EAEAEA" }} />

      {/* Pinned Portfolio Projects */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "8px", height: "40px", backgroundColor: "#C3A85E", borderRadius: "4px", flexShrink: 0 }} />
            <p style={{ ...SF, fontWeight: 700, fontSize: "36px", color: "#272727", margin: 0 }}>
              Trabalhos em destaque
            </p>
            <span style={{ ...SF, fontWeight: 400, fontSize: "24px", color: "#8E8D8C" }}>
              {PINNED_PROJECTS.length}/3 fixados
            </span>
          </div>
          <button
            style={{ ...SF, padding: "12px 28px", borderRadius: "30px", border: "1.5px solid #E0C271", backgroundColor: "transparent", fontSize: "24px", color: "#C3A85E", fontWeight: 500, cursor: "pointer", transition: "background-color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(224,194,113,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Ver portfólio completo →
          </button>
        </div>

        {/* Horizontal scroll of pinned project cards */}
        <div
          className="profile-media-scroll"
          style={{ display: "flex", gap: "28px", overflowX: "auto", paddingBottom: "10px" } as React.CSSProperties}
        >
          {PINNED_PROJECTS.map((p) => (
            <PinnedProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<ProfileView>("contratante");

  const [nome, setNome] = useState<string>("");
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;

    (async () => {
      try {
        const usuario = await ClientGateway.getUsuario(userId);
        if (usuario?.nome) setNome(usuario.nome);
        if (usuario?.foto_url) setFotoUrl(resolveFoto(usuario.foto_url));
      } catch {
        /* mantém os valores padrão */
      }
      // bio só existe no perfil de prestador (opcional)
      try {
        const prestador = await ClientGateway.getPrestador(userId);
        if (prestador?.bio) setBio(prestador.bio);
        if (!fotoUrl && prestador?.foto_url) setFotoUrl(resolveFoto(prestador.foto_url));
      } catch {
        /* usuário pode não ser prestador */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = nome ? nome.split(" ")[0] : "Usuário";
  const avatarSrc = fotoUrl ?? "/images/profile.svg";

  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  const menuItems = [
    { icon: "message.svg",  iconW: 42, iconH: 40, label: "Mensagens",    href: "/messages" },
    { icon: "settings.svg", iconW: 40, iconH: 40, label: "Configurações", href: "/settings" },
    { icon: "mode.svg",     iconW: 40, iconH: 40, label: "Modo escuro",  hasSwitch: true,  href: null },
    { icon: "help.svg",     iconW: 40, iconH: 40, label: "Ajuda",        href: null },
    { icon: "logout.svg",   iconW: 40, iconH: 40, label: "Sair da conta", href: null },
  ];

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

        /* Menu panel */
        .profile-menu-panel {
          position: fixed; top: 90px; right: 0; width: 520px; height: calc(100vh - 90px);
          border-radius: 40px 0 0 40px; background-color: rgba(39,39,39,0.92);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.28); z-index: 99;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.645,0.045,0.355,1); overflow: hidden;
        }
        .profile-menu-panel.open { transform: translateX(0); }

        /* View fade */
        @keyframes viewFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .view-content { animation: viewFade 0.3s ease forwards; }
      `}</style>

      {/* ── CABEÇALHO ─────────────────────────────────────────────────────────── */}
      <header style={{ width: "100%", height: "90px", backgroundColor: "#E0C271", display: "flex", alignItems: "center", position: "sticky", top: 0, zIndex: 50, flexShrink: 0 }}>
        <div style={{ position: "absolute", top: "15px", left: "40px", zIndex: 20 }}>
          <Image src="/images/logo_domi.svg" alt="Logo DOMI" width={70} height={60} style={{ display: "block" }} />
        </div>
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", lineHeight: 1, marginLeft: "130px", letterSpacing: "-1px", userSelect: "none" }}>
          DOMI
        </span>
        <div style={{ flex: 1 }} />
        <Image src="/images/profile_notify.svg" alt="Perfil" width={52} height={53} style={{ display: "block", cursor: "pointer" }} />
        <Image src="/images/navy.svg" alt="Menu" width={60} height={50} onClick={() => setMenuOpen((v) => !v)} style={{ display: "block", marginLeft: "60px", marginRight: "80px", cursor: "pointer" }} />
      </header>

      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />}

      {/* ── GLASS MENU ────────────────────────────────────────────────────────── */}
      <div className={`profile-menu-panel${menuOpen ? " open" : ""}`}>
        <p style={{ ...SF, fontWeight: 600, fontSize: "50px", color: "#FAF9F5", margin: 0, marginTop: "60px", marginLeft: "40px", lineHeight: 1.1 }}>Olá, {firstName}!</p>
        {(() => {
          const firstLineTop = 145, rowHeight = 90;
          return (
            <>
              {[0,1,2,3,4,5].map((i) => (
                <div key={i} style={{ position: "absolute", left: 0, width: "520px", height: "2px", backgroundColor: "rgba(255,255,255,0.15)", top: `${firstLineTop + i * rowHeight}px` }} />
              ))}
              {menuItems.map((item, i) => {
                const cy = firstLineTop + i * rowHeight + rowHeight / 2;
                return (
                  <div key={item.label} onClick={() => { if (item.label === "Sair da conta") handleLogout(); else if (item.href) router.push(item.href); }} style={{ position: "absolute", top: `${cy}px`, transform: "translateY(-50%)", left: "40px", display: "flex", alignItems: "center", gap: "15px", cursor: "hasSwitch" in item && item.hasSwitch ? "default" : "pointer" }}>
                    <Image src={`/images/${item.icon}`} alt={item.label} width={item.iconW} height={item.iconH} style={{ flexShrink: 0 }} />
                    <span style={{ ...SF, fontWeight: 500, fontSize: "40px", color: "#FAF9F5", userSelect: "none" }} onMouseEnter={(e) => { if (!("hasSwitch" in item && item.hasSwitch)) e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>
                      {item.label}
                    </span>
                    {"hasSwitch" in item && item.hasSwitch && (
                      <div onClick={(e) => { e.stopPropagation(); setDarkMode((v) => !v); }} style={{ marginLeft: "60px", width: "80px", height: "40px", borderRadius: "20px", backgroundColor: darkMode ? "#E0C271" : "#C3C3C3", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background-color 0.3s" }}>
                        <div style={{ position: "absolute", top: "50%", left: darkMode ? "calc(100% - 37px)" : "4px", transform: "translateY(-50%)", width: "33px", height: "33px", borderRadius: "50%", backgroundColor: "#FAF9F5", transition: "left 0.3s cubic-bezier(0.645,0.045,0.355,1)", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>

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
          {view === "contratante" ? <ProfileContratante /> : <ProfileProfissional />}
        </div>
      </div>
    </div>
  );
}
