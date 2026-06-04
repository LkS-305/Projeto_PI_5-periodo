"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Availability = "hoje" | "amanha" | "indisponivel";

interface MediaItem {
  type: "photo" | "video";
}

interface Worker {
  id: number;
  name: string;
  role: string;
  city: string;
  rating: number;
  media: MediaItem[];
  tags: string[];
  distance: string;
  availability: Availability;
}

interface Category {
  label: string;
  workers: Worker[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    label: "Pintor(a)",
    workers: [
      {
        id: 1,
        name: "Matheus S.",
        role: "Pintor",
        city: "São Paulo, SP",
        rating: 4.9,
        media: [
          { type: "photo" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
        ],
        tags: ["Paredes", "Tetos"],
        distance: "1,2km",
        availability: "hoje",
      },
      {
        id: 2,
        name: "Márcio A.",
        role: "Pintor",
        city: "Aracaju, SE",
        rating: 4.9,
        media: [
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
        ],
        tags: ["Azulejo", "Louça"],
        distance: "8,2km",
        availability: "amanha",
      },
      {
        id: 3,
        name: "Davi P.",
        role: "Pintor",
        city: "Belém, PA",
        rating: 4.7,
        media: [
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
        ],
        tags: ["Portões"],
        distance: "5,6km",
        availability: "indisponivel",
      },
      {
        id: 4,
        name: "Fernanda C.",
        role: "Pintora",
        city: "Fortaleza, CE",
        rating: 5.0,
        media: [
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
        ],
        tags: ["Fachada", "Tetos", "Gesso"],
        distance: "3,4km",
        availability: "hoje",
      },
    ],
  },
  {
    label: "Pedreiro(a)",
    workers: [
      {
        id: 5,
        name: "Matheus A.",
        role: "Pedreiro",
        city: "São Paulo, SP",
        rating: 4.9,
        media: [
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
        ],
        tags: ["Alvenaria", "Reboco"],
        distance: "2,1km",
        availability: "hoje",
      },
      {
        id: 6,
        name: "Márcio B.",
        role: "Pedreiro",
        city: "Aracaju, SE",
        rating: 4.9,
        media: [
          { type: "photo" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
        ],
        tags: ["Azulejo", "Piso", "Contrapiso"],
        distance: "6,7km",
        availability: "amanha",
      },
      {
        id: 7,
        name: "Davi R.",
        role: "Pedreiro",
        city: "Belém, PA",
        rating: 4.6,
        media: [{ type: "photo" }, { type: "video" }, { type: "photo" }],
        tags: ["Demolição", "Estrutura"],
        distance: "9,3km",
        availability: "hoje",
      },
    ],
  },
  {
    label: "Eletricista",
    workers: [
      {
        id: 8,
        name: "Lucas F.",
        role: "Eletricista",
        city: "São Paulo, SP",
        rating: 4.8,
        media: [
          { type: "photo" },
          { type: "video" },
          { type: "photo" },
          { type: "photo" },
        ],
        tags: ["Quadro elétrico", "Tomadas"],
        distance: "0,8km",
        availability: "hoje",
      },
      {
        id: 9,
        name: "Ana S.",
        role: "Eletricista",
        city: "Curitiba, PR",
        rating: 4.7,
        media: [{ type: "photo" }, { type: "photo" }, { type: "video" }],
        tags: ["Iluminação", "Projeto", "AR"],
        distance: "7,1km",
        availability: "amanha",
      },
    ],
  },
];

// ─── Availability helpers ─────────────────────────────────────────────────────

const availabilityLabel: Record<Availability, string> = {
  hoje: "Disponível hoje",
  amanha: "Disponível amanhã",
  indisponivel: "Indisponível",
};

const availabilityColor: Record<Availability, string> = {
  hoje: "#3DBD7D",
  amanha: "#F5A623",
  indisponivel: "#AAAAAA",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkerCard({ worker }: { worker: Worker }) {
  const dotColor = availabilityColor[worker.availability];
  const availLabel = availabilityLabel[worker.availability];
  const mediaScrollRef = React.useRef<HTMLDivElement>(null);

  // Dim media items that are partially clipped by the scroll container
  React.useEffect(() => {
    const container = mediaScrollRef.current;
    if (!container) return;

    const update = () => {
      const items = container.querySelectorAll<HTMLDivElement>(".media-item");
      const cLeft = container.getBoundingClientRect().left;
      const cRight = container.getBoundingClientRect().right;
      items.forEach((item) => {
        const r = item.getBoundingClientRect();
        const fullyVisible = r.left >= cLeft - 1 && r.right <= cRight + 1;
        item.style.backgroundColor = fullyVisible ? "#535353" : "#A7A6A4";
      });
    };

    update();
    container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, []);

  // Card dimensions per spec
  const CARD_W = 700;
  const CARD_H = 400;

  return (
    <div
      style={{
        flexShrink: 0,
        width: `${CARD_W}px`,
        height: `${CARD_H}px`,
        backgroundColor: "#FAF9F5",
        border: "6px solid #E0C271",
        borderRadius: "40px",
        boxSizing: "border-box",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.18s, transform 0.18s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 16px 48px rgba(224,194,113,0.35)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* ── Row 1: profile icon + name/subtitle + rating ── */}
      {/* profile_explore.svg: 30px from left edge, vertically centred on name */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "30px",
          width: "60px",
          height: "60px",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/profile_explore.svg"
          alt={worker.name}
          width={60}
          height={60}
          style={{ display: "block" }}
        />
      </div>

      {/* Name — 15px from top, 15px gap from profile icon (30+60+15 = 105px left) */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "105px",
          right: "130px", // leave room for rating on right
        }}
      >
        <div
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "30px",
            color: "#272727",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1,
          }}
        >
          {worker.name}
        </div>
        {/* Role • City, State — immediately below name */}
        <div
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "25px",
            color: "#535353",
            marginTop: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1,
          }}
        >
          {worker.role} • {worker.city}
        </div>
      </div>

      {/* Rating — same top as name, 30px from right edge */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "30px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "30px",
            color: "#272727",
            lineHeight: 1,
          }}
        >
          {worker.rating.toFixed(1)}
        </span>
        <Image
          src="/images/review.svg"
          alt="Avaliação"
          width={20}
          height={20}
        />
      </div>

      {/* ── Row 2: media strip ── */}
      {/* 30px below the subtitle text. subtitle top = 15 + 30(name lh) + 4 = 49px, height ~25px → bottom ≈ 74px. Gap 30px → top of media = 104px */}
      <div
        style={{
          position: "absolute",
          top: "104px",
          left: 0,
          right: 0,
          height: "160px",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          gap: "15px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
        ref={mediaScrollRef}
        className="media-scroll"
      >
        {worker.media.map((m, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: "120px",
              height: "160px",
              backgroundColor: "#535353",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="media-item"
          >
            <Image
              src={
                m.type === "video" ? "/images/play.svg" : "/images/picture.svg"
              }
              alt={m.type === "video" ? "Vídeo" : "Foto"}
              width={m.type === "video" ? 50 : 58}
              height={m.type === "video" ? 50 : 50}
              style={{ display: "block" }}
            />
          </div>
        ))}
      </div>

      {/* ── Row 3: tags ── 30px below media (104 + 160 + 30 = 294px) */}
      <div
        style={{
          position: "absolute",
          top: "294px",
          left: "30px",
          right: "30px",
          display: "flex",
          flexWrap: "nowrap",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        {worker.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "5px 16px",
              backgroundColor: "#8E8D8C",
              borderRadius: "30px",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "25px",
              color: "#FAF9F5",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* ── Row 4: distance + availability ── 30px below tags */}
      {/* tags top 294, tags height ~36px, gap 30 → 360px */}
      <div
        style={{
          position: "absolute",
          top: "340px",
          left: "30px",
          right: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Distance: location icon + text */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Image
            src="/images/location.svg"
            alt="Distância"
            width={22}
            height={25}
            style={{ display: "block" }}
          />
          <span
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "25px",
              color: "#535353",
              lineHeight: 1,
            }}
          >
            {worker.distance}
          </span>
        </div>

        {/* Availability: text + dot */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "25px",
              color: dotColor,
              lineHeight: 1,
            }}
          >
            {availLabel}
          </span>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: dotColor,
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Filter / Sort modals ─────────────────────────────────────────────────────

const FILTER_SECTIONS = [
  {
    title: "Disponibilidade",
    chips: ["Disponível hoje", "Disponível amanhã", "Esta semana"],
  },
  {
    title: "Distância",
    chips: ["Até 2km", "Até 5km", "Até 10km", "Qualquer"],
  },
  {
    title: "Avaliação mínima",
    chips: ["4.0+", "4.5+", "5.0"],
  },
];

const SORT_OPTIONS = [
  "Mais próximo",
  "Melhor avaliado",
  "Disponível primeiro",
  "Relevância",
];

function FilterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (chip: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(chip) ? next.delete(chip) : next.add(chip);
      return next;
    });
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
      }}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* sheet */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FAF9F5",
          borderRadius: "40px 40px 0 0",
          padding: "30px 50px 60px",
          animation: "slideUp 0.3s cubic-bezier(0.25,0.8,0.25,1)",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>

        {/* handle */}
        <div
          style={{
            width: "60px",
            height: "6px",
            background: "#DEDEDE",
            borderRadius: "3px",
            margin: "0 auto 30px",
          }}
        />

        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "36px",
            color: "#272727",
            marginBottom: "30px",
          }}
        >
          Filtrar
        </p>

        {FILTER_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: "30px" }}>
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: "20px",
                color: "#888888",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "14px",
              }}
            >
              {section.title}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {section.chips.map((chip) => {
                const isSelected = selected.has(chip);
                return (
                  <div
                    key={chip}
                    onClick={() => toggle(chip)}
                    style={{
                      padding: "10px 24px",
                      border: `2px solid ${isSelected ? "#272727" : "#DEDEDE"}`,
                      borderRadius: "30px",
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 500,
                      fontSize: "22px",
                      color: isSelected ? "#FAF9F5" : "#272727",
                      backgroundColor: isSelected ? "#272727" : "#FFFFFF",
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "all 0.15s",
                    }}
                  >
                    {chip}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "22px",
            background: "#E0C271",
            border: "none",
            borderRadius: "20px",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "#272727",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}

function SortModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState("Relevância");

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FAF9F5",
          borderRadius: "40px 40px 0 0",
          padding: "30px 50px 60px",
          animation: "slideUp 0.3s cubic-bezier(0.25,0.8,0.25,1)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "6px",
            background: "#DEDEDE",
            borderRadius: "3px",
            margin: "0 auto 30px",
          }}
        />

        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "36px",
            color: "#272727",
            marginBottom: "20px",
          }}
        >
          Ordenar por
        </p>

        <div
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            border: "1.5px solid #DEDEDE",
          }}
        >
          {SORT_OPTIONS.map((opt, i) => {
            const isSelected = selected === opt;
            const isLast = i === SORT_OPTIONS.length - 1;
            return (
              <div
                key={opt}
                onClick={() => setSelected(opt)}
                style={{
                  padding: "22px 28px",
                  borderBottom: isLast ? "none" : "1.5px solid #DEDEDE",
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: "26px",
                  color: isSelected ? "#272727" : "#535353",
                  backgroundColor: isSelected ? "#FDF6E3" : "#FFFFFF",
                  cursor: "pointer",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background-color 0.15s",
                }}
              >
                {opt}
                {isSelected && (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#E0C271",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "22px",
            background: "#E0C271",
            border: "none",
            borderRadius: "20px",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "28px",
            color: "#272727",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
          }
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const { logout } = useSession();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#FAF9F5",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
    >
      <style>{`
        .menu-panel {
          position: absolute;
          top: 90px;
          right: 0px;
          width: 520px;
          height: calc(100vh - 90px);
          border-radius: 40px 0 0 40px;
          background-color: rgba(39, 39, 39, 0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.28);
          z-index: 99;
          overflow: hidden;
          flex-shrink: 0;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .menu-panel.open {
          transform: translateX(0);
        }

        /* media scroll inside cards */
        .media-scroll::-webkit-scrollbar { display: none; }
        .media-scroll { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .media-item { scroll-snap-align: start; transition: background-color 0.2s; }

        /* cards horizontal row */
        .cards-row::-webkit-scrollbar { display: none; }
        .cards-row { -ms-overflow-style: none; scrollbar-width: none; }

        /* vertical results scrollbar — 15px wide glass */
        .results-scroll {
          overflow-y: auto;
          overflow-x: hidden;
        }
        .results-scroll::-webkit-scrollbar { width: 15px; }
        .results-scroll::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 8px;
          margin: 24px 0;
        }
        .results-scroll::-webkit-scrollbar-thumb {
          background: rgba(39,39,39,0.18);
          border-radius: 8px;
          border: 3px solid transparent;
          background-clip: padding-box;
        }
        .results-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(39,39,39,0.32);
          background-clip: padding-box;
        }
        .results-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(39,39,39,0.18) rgba(255,255,255,0.18);
        }
      `}</style>

      {/* ── CABEÇALHO ── */}
      <header
        style={{
          width: "100%",
          height: "90px",
          backgroundColor: "#E0C271",
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
          marginBottom: "35px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "40px",
            zIndex: 20,
          }}
        >
          <Image
            src="/images/logo_domi.svg"
            alt="Logo DOMI"
            width={70}
            height={60}
            style={{ display: "block" }}
          />
        </div>

        <span
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: "70px",
            color: "#272727",
            lineHeight: 1,
            marginLeft: "130px",
            letterSpacing: "-1px",
            userSelect: "none",
          }}
        >
          DOMI
        </span>

        <div style={{ flex: 1 }} />

        <Image
          src="/images/profile_notify.svg"
          alt="Perfil"
          width={52}
          height={53}
          onClick={() => router.push("/profile")}
          style={{ display: "block", cursor: "pointer" }}
        />

        <Image
          src="/images/navy.svg"
          alt="Menu"
          width={60}
          height={50}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "block",
            marginLeft: "60px",
            marginRight: "80px",
            cursor: "pointer",
          }}
        />
      </header>

      {/* ── OVERLAY para fechar menu ao clicar fora ── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 98 }}
        />
      )}

      {/* ── GLASS MENU PANEL ── */}
      <div className={`menu-panel${menuOpen ? " open" : ""}`}>
        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "50px",
            color: "#FAF9F5",
            margin: 0,
            marginTop: "60px",
            marginLeft: "40px",
            lineHeight: 1.1,
          }}
        >
          Olá, Usuário!
        </p>

        {(() => {
          const lineStyle: React.CSSProperties = {
            position: "absolute",
            left: "0px",
            width: "520px",
            height: "2px",
            backgroundColor: "#FAF9F5",
          };

          const firstLineTop = 145;
          const rowHeight = 90;

          const menuItems = [
            {
              icon: "message.svg",
              iconW: 42,
              iconH: 40,
              label: "Mensagens",
              hasSwitch: false,
              href: "/messages",
            },
            {
              icon: "settings.svg",
              iconW: 40,
              iconH: 40,
              label: "Configurações",
              hasSwitch: false,
              href: null,
            },
            {
              icon: "mode.svg",
              iconW: 40,
              iconH: 40,
              label: "Modo escuro",
              hasSwitch: true,
              href: null,
            },
            {
              icon: "help.svg",
              iconW: 40,
              iconH: 40,
              label: "Ajuda",
              hasSwitch: false,
              href: null,
            },
            {
              icon: "logout.svg",
              iconW: 40,
              iconH: 40,
              label: "Sair da conta",
              hasSwitch: false,
              href: null,
            },
          ];

          return (
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`line-${i}`}
                  style={{
                    ...lineStyle,
                    top: `${firstLineTop + i * rowHeight}px`,
                  }}
                />
              ))}

              {menuItems.map((item, i) => {
                const centerY = firstLineTop + i * rowHeight + rowHeight / 2;
                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      if (item.label === "Sair da conta") handleLogout();
                      else if (item.href) router.push(item.href);
                    }}
                    style={{
                      position: "absolute",
                      top: `${centerY}px`,
                      transform: "translateY(-50%)",
                      left: "40px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      cursor: item.hasSwitch ? "default" : "pointer",
                    }}
                  >
                    <Image
                      src={`/images/${item.icon}`}
                      alt={item.label}
                      width={item.iconW}
                      height={item.iconH}
                      style={{ flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily: "'SF Pro Text', system-ui, sans-serif",
                        fontWeight: 500,
                        fontSize: "40px",
                        color: "#FAF9F5",
                        userSelect: "none",
                        transition: "text-decoration 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (!item.hasSwitch)
                          e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        if (!item.hasSwitch)
                          e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      {item.label}
                    </span>

                    {item.hasSwitch && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setDarkMode((v) => !v);
                        }}
                        style={{
                          marginLeft: "60px",
                          width: "80px",
                          height: "40px",
                          borderRadius: "20px",
                          backgroundColor: darkMode ? "#E0C271" : "#C3C3C3",
                          position: "relative",
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: darkMode ? "calc(100% - 37px)" : "4px",
                            transform: "translateY(-50%)",
                            width: "33px",
                            height: "33px",
                            borderRadius: "50%",
                            backgroundColor: "#FAF9F5",
                            transition:
                              "left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>

      {/* ── BARRA DE PESQUISA + BOTÃO VOLTAR ── */}
      <div style={{ position: "relative", marginBottom: "50px" }}>
        {/* Barra de pesquisa */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "1710px",
            height: "80px",
            backgroundColor: "#EAEAEA",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.25)",
            borderRadius: "60px",
            marginLeft: "105px",
            paddingLeft: "50px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/Lupa.svg"
            alt="Buscar"
            width={50}
            height={50}
            style={{ flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Que serviço você precisa hoje?"
            style={{
              flex: 1,
              marginLeft: "30px",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "40px",
              color: "#535353",
            }}
          />
        </div>

        {/* Botão voltar */}
        <div
          onClick={() => router.push("/home")}
          style={{
            position: "absolute",
            top: "calc(100% + 20px)",
            left: "105px",
            fontSize: "30px",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 500,
            color: "#272727",
            cursor: "pointer",
            userSelect: "none",
            zIndex: 5,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.textDecoration = "underline")
          }
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          ← Voltar
        </div>
      </div>

      {/* ── ÁREA DE RESULTADOS ── */}
      {/*
        Vertical scroll container with glass scrollbar.
        marginTop accounts for: header (90) + marginBottom on header (35) + search wrapper (80+50) + Voltar (50) + gap (70) = handled via positioning above.
        We use marginTop: 70 to match spec "70px from search bar".
      */}
      <div
        className="results-scroll"
        style={{
          marginTop: "70px",
          paddingBottom: "80px",
          height: "calc(100vh - 90px - 35px - 80px - 50px - 70px)",
        }}
      >
        {/* ── Ordenar + Filtrar — right-aligned, right padding 70px ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "20px",
            marginBottom: "50px",
            paddingRight: "70px",
            paddingLeft: "40px",
          }}
        >
          {/* Ordenar */}
          <div
            onClick={() => setSortOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 32px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #DEDEDE",
              borderRadius: "50px",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "26px",
              color: "#272727",
              cursor: "pointer",
              userSelect: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#272727";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 6px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#DEDEDE";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 14px rgba(0,0,0,0.07)";
            }}
          >
            <Image
              src="/images/ordenar.svg"
              alt="Ordenar"
              width={28}
              height={28}
            />
            Ordenar
          </div>

          {/* Filtrar */}
          <div
            onClick={() => setFilterOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 32px",
              backgroundColor: "#FFFFFF",
              border: "2px solid #DEDEDE",
              borderRadius: "50px",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "26px",
              color: "#272727",
              cursor: "pointer",
              userSelect: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.07)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#272727";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 6px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#DEDEDE";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 14px rgba(0,0,0,0.07)";
            }}
          >
            <Image
              src="/images/filter.svg"
              alt="Filtrar"
              width={28}
              height={28}
            />
            Filtrar
          </div>
        </div>

        {/* ── Categories + Worker cards ── */}
        {CATEGORIES.map((category) => (
          <div key={category.label} style={{ marginBottom: "60px" }}>
            {/* Category title: 40px left padding, SF Pro Semibold 40 #272727 */}
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: "40px",
                color: "#272727",
                margin: 0,
                marginBottom: "15px",
                paddingLeft: "40px",
              }}
            >
              {category.label}
            </p>

            {/*
              Cards row: horizontally scrollable (Netflix-style), no wrap.
              paddingLeft: 40px so first card starts 40px from left edge.
              paddingRight: 70px so last card ends 70px from right edge.
            */}
            <div
              className="cards-row"
              style={{
                display: "flex",
                gap: "30px",
                overflowX: "auto",
                paddingLeft: "40px",
                paddingRight: "70px",
                paddingBottom: "8px",
                boxSizing: "content-box",
              }}
            >
              {category.workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Modals ── */}
      <FilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />
      <SortModal open={sortOpen} onClose={() => setSortOpen(false)} />
    </div>
  );
}
