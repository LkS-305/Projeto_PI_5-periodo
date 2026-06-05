"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailabilityKey = "hoje" | "amanha" | "semana" | "quinze" | "mes" | "indisponivel";
type ViewState = "form" | "searching" | "results";

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
  distanceKm: number;
  distance: string;
  availability: AvailabilityKey;
  profession: string;
}

interface FormState {
  profession: string;
  specialties: string[];
  maxKm: number | null;
  availability: AvailabilityKey | "";
  minRating: number | null;
}

// ─── Profissões & Especialidades ─────────────────────────────────────────────

interface Profession {
  label: string;
  value: string;
  specialties: string[];
}

const PROFESSIONS: Profession[] = [
  {
    label: "Pintor(a)",
    value: "pintor",
    specialties: ["Paredes", "Tetos", "Fachada", "Madeira", "Gesso", "Verniz"],
  },
  {
    label: "Pedreiro(a)",
    value: "pedreiro",
    specialties: [
      "Alvenaria",
      "Reboco",
      "Azulejo",
      "Piso",
      "Contrapiso",
      "Demolição",
      "Estrutura",
    ],
  },
  {
    label: "Eletricista",
    value: "eletricista",
    specialties: [
      "Quadro Elétrico",
      "Tomadas",
      "Iluminação",
      "Projeto Elétrico",
      "Ar-condicionado",
    ],
  },
  {
    label: "Encanador(a)",
    value: "encanador",
    specialties: [
      "Tubulação",
      "Hidráulica",
      "Box",
      "Aquecedor",
      "Desentupimento",
    ],
  },
  {
    label: "Marceneiro(a)",
    value: "marceneiro",
    specialties: ["Móveis Planejados", "Portas", "Janelas", "Deck", "Cozinha"],
  },
  {
    label: "Azulejista",
    value: "azulejista",
    specialties: ["Piso", "Revestimento", "Banheiro", "Área Externa", "Piscina"],
  },
  {
    label: "Técnico de A/C",
    value: "tecnico_ac",
    specialties: ["Instalação", "Manutenção", "Higienização", "Recarga de Gás"],
  },
  {
    label: "Gesseiro(a)",
    value: "gesseiro",
    specialties: ["Teto", "Parede", "Moldura", "Sancas", "Rebaixamento"],
  },
];

// ─── Mock de profissionais ────────────────────────────────────────────────────

const ALL_WORKERS: Worker[] = [
  // Pintores
  { id: 1, name: "Matheus S.", role: "Pintor", city: "São Paulo, SP", rating: 4.9, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }, { type: "photo" }, { type: "video" }], tags: ["Paredes", "Tetos"], distanceKm: 1.2, distance: "1,2km", availability: "hoje", profession: "pintor" },
  { id: 2, name: "Fernanda C.", role: "Pintora", city: "Fortaleza, CE", rating: 5.0, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Fachada", "Tetos", "Gesso"], distanceKm: 3.4, distance: "3,4km", availability: "hoje", profession: "pintor" },
  { id: 3, name: "Márcio A.", role: "Pintor", city: "Aracaju, SE", rating: 4.9, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Madeira", "Verniz"], distanceKm: 8.2, distance: "8,2km", availability: "amanha", profession: "pintor" },
  { id: 4, name: "Davi P.", role: "Pintor", city: "Belém, PA", rating: 4.7, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }], tags: ["Paredes", "Gesso"], distanceKm: 5.6, distance: "5,6km", availability: "indisponivel", profession: "pintor" },
  { id: 5, name: "Carla M.", role: "Pintora", city: "Rio de Janeiro, RJ", rating: 4.8, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }, { type: "photo" }], tags: ["Fachada", "Madeira"], distanceKm: 12.1, distance: "12,1km", availability: "semana", profession: "pintor" },
  { id: 6, name: "Rafael B.", role: "Pintor", city: "Belo Horizonte, MG", rating: 4.6, media: [{ type: "photo" }, { type: "photo" }], tags: ["Tetos", "Verniz"], distanceKm: 2.8, distance: "2,8km", availability: "quinze", profession: "pintor" },
  // Pedreiros
  { id: 7, name: "Matheus A.", role: "Pedreiro", city: "São Paulo, SP", rating: 4.9, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Alvenaria", "Reboco"], distanceKm: 2.1, distance: "2,1km", availability: "hoje", profession: "pedreiro" },
  { id: 8, name: "Márcio B.", role: "Pedreiro", city: "Aracaju, SE", rating: 4.9, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }, { type: "photo" }], tags: ["Azulejo", "Piso", "Contrapiso"], distanceKm: 6.7, distance: "6,7km", availability: "amanha", profession: "pedreiro" },
  { id: 9, name: "Davi R.", role: "Pedreiro", city: "Belém, PA", rating: 4.6, media: [{ type: "photo" }, { type: "video" }], tags: ["Demolição", "Estrutura"], distanceKm: 9.3, distance: "9,3km", availability: "hoje", profession: "pedreiro" },
  { id: 10, name: "Jorge L.", role: "Pedreiro", city: "Campinas, SP", rating: 4.8, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Piso", "Reboco"], distanceKm: 4.5, distance: "4,5km", availability: "semana", profession: "pedreiro" },
  // Eletricistas
  { id: 11, name: "Lucas F.", role: "Eletricista", city: "São Paulo, SP", rating: 4.8, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Quadro Elétrico", "Tomadas"], distanceKm: 0.8, distance: "0,8km", availability: "hoje", profession: "eletricista" },
  { id: 12, name: "Ana S.", role: "Eletricista", city: "Curitiba, PR", rating: 4.7, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }], tags: ["Iluminação", "Projeto Elétrico"], distanceKm: 7.1, distance: "7,1km", availability: "amanha", profession: "eletricista" },
  { id: 13, name: "Roberto F.", role: "Eletricista", city: "Recife, PE", rating: 5.0, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }, { type: "video" }], tags: ["Ar-condicionado", "Quadro Elétrico"], distanceKm: 3.2, distance: "3,2km", availability: "hoje", profession: "eletricista" },
  // Encanadores
  { id: 14, name: "Pedro H.", role: "Encanador", city: "São Paulo, SP", rating: 4.9, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Tubulação", "Hidráulica"], distanceKm: 1.5, distance: "1,5km", availability: "hoje", profession: "encanador" },
  { id: 15, name: "Tatiane B.", role: "Encanadora", city: "Belo Horizonte, MG", rating: 4.8, media: [{ type: "photo" }, { type: "photo" }], tags: ["Aquecedor", "Desentupimento"], distanceKm: 6.3, distance: "6,3km", availability: "semana", profession: "encanador" },
  // Marceneiros
  { id: 16, name: "João V.", role: "Marceneiro", city: "Porto Alegre, RS", rating: 5.0, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }, { type: "photo" }, { type: "video" }], tags: ["Móveis Planejados", "Cozinha"], distanceKm: 4.0, distance: "4,0km", availability: "hoje", profession: "marceneiro" },
  { id: 17, name: "Lucas S.", role: "Marceneiro", city: "São Paulo, SP", rating: 4.9, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }], tags: ["Portas", "Janelas", "Deck"], distanceKm: 7.5, distance: "7,5km", availability: "amanha", profession: "marceneiro" },
  // Azulejistas
  { id: 18, name: "Miguel A.", role: "Azulejista", city: "Manaus, AM", rating: 5.0, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Piso", "Banheiro"], distanceKm: 2.3, distance: "2,3km", availability: "hoje", profession: "azulejista" },
  { id: 19, name: "Mariana C.", role: "Azulejista", city: "Florianópolis, SC", rating: 4.8, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Revestimento", "Área Externa"], distanceKm: 8.9, distance: "8,9km", availability: "semana", profession: "azulejista" },
  // Técnicos A/C
  { id: 20, name: "Ricardo T.", role: "Técnico de A/C", city: "Curitiba, PR", rating: 4.9, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Instalação", "Manutenção"], distanceKm: 5.5, distance: "5,5km", availability: "hoje", profession: "tecnico_ac" },
  { id: 21, name: "Bianca L.", role: "Técnica de A/C", city: "Goiânia, GO", rating: 4.7, media: [{ type: "photo" }, { type: "video" }], tags: ["Higienização", "Recarga de Gás"], distanceKm: 11.3, distance: "11,3km", availability: "amanha", profession: "tecnico_ac" },
  // Gesseiros
  { id: 22, name: "Sandra O.", role: "Gesseira", city: "São Paulo, SP", rating: 4.8, media: [{ type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Teto", "Sancas", "Rebaixamento"], distanceKm: 3.7, distance: "3,7km", availability: "hoje", profession: "gesseiro" },
  { id: 23, name: "Eduardo M.", role: "Gesseiro", city: "Santos, SP", rating: 5.0, media: [{ type: "photo" }, { type: "photo" }, { type: "video" }, { type: "photo" }], tags: ["Moldura", "Parede", "Teto"], distanceKm: 9.1, distance: "9,1km", availability: "semana", profession: "gesseiro" },
];

// ─── Helpers de disponibilidade ───────────────────────────────────────────────

const availabilityLabel: Record<AvailabilityKey, string> = {
  hoje: "Disponível hoje",
  amanha: "Disponível amanhã",
  semana: "Esta semana",
  quinze: "Próximos 15 dias",
  mes: "Este mês",
  indisponivel: "Indisponível",
};

const availabilityColor: Record<AvailabilityKey, string> = {
  hoje: "#3DBD7D",
  amanha: "#F5A623",
  semana: "#F5A623",
  quinze: "#F5A623",
  mes: "#F5A623",
  indisponivel: "#AAAAAA",
};

// Prioridade para filtro de disponibilidade
const avPriority: Record<AvailabilityKey | "", number> = {
  "": 0,
  indisponivel: 1,
  mes: 2,
  quinze: 3,
  semana: 4,
  amanha: 5,
  hoje: 6,
};

// ─── Lógica de filtro ─────────────────────────────────────────────────────────

function filterWorkers(workers: Worker[], form: FormState): Worker[] {
  return workers.filter((w) => {
    if (form.profession && w.profession !== form.profession) return false;
    if (form.specialties.length > 0 && !form.specialties.some((s) => w.tags.includes(s))) return false;
    if (form.maxKm !== null && w.distanceKm > form.maxKm) return false;
    if (form.availability) {
      if (avPriority[w.availability] < avPriority[form.availability]) return false;
    }
    if (form.minRating !== null && w.rating < form.minRating) return false;
    return true;
  });
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        padding: "10px 28px",
        border: `2px solid ${selected ? "#E0C271" : "rgba(255,255,255,0.18)"}`,
        borderRadius: "50px",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        fontWeight: selected ? 600 : 400,
        fontSize: "26px",
        color: selected ? "#E0C271" : "#C8C7C5",
        backgroundColor: selected ? "rgba(224,194,113,0.12)" : "transparent",
        cursor: "pointer",
        userSelect: "none",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#C3A85E";
          (e.currentTarget as HTMLDivElement).style.color = "#C3A85E";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(255,255,255,0.18)";
          (e.currentTarget as HTMLDivElement).style.color = "#C8C7C5";
        }
      }}
    >
      {label}
    </div>
  );
}

// ─── Divider entre seções ─────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div
      style={{
        width: "100%",
        height: "1.5px",
        backgroundColor: "rgba(195,168,94,0.35)",
        margin: "36px 0",
      }}
    />
  );
}

// ─── LocationSlider ───────────────────────────────────────────────────────────

const MAX_KM = 50;

function LocationSlider({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (km: number | null) => void;
}) {
  const sliderValue = value === null ? MAX_KM : value;
  const isAny = value === null;
  const pct = ((sliderValue - 1) / (MAX_KM - 1)) * 100;

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "22px" }}>
        <span style={{
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "30px",
          color: isAny ? "#888" : "#E0C271",
          transition: "color 0.2s",
        }}>
          {isAny ? "Qualquer distância" : `Até ${sliderValue} km`}
        </span>
        {!isAny && (
          <button
            onClick={() => onChange(null)}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: "22px",
              cursor: "pointer",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Limpar
          </button>
        )}
      </div>

      <input
        type="range"
        min={1}
        max={MAX_KM}
        step={1}
        value={sliderValue}
        onChange={(e) => {
          const v = parseInt(e.target.value);
          onChange(v >= MAX_KM ? null : v);
        }}
        className="demand-slider"
        style={{
          width: "100%",
          background: `linear-gradient(to right, #E0C271 0%, #E0C271 ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        {["1 km", "15 km", "30 km", "50 km+"].map((l) => (
          <span key={l} style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "20px", color: "#666" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── RatingSlider ─────────────────────────────────────────────────────────────

function RatingSlider({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number | null) => void;
}) {
  const sliderValue = value === null ? 0 : value;
  const pct = (sliderValue / 5) * 100;
  const showTooltip = sliderValue > 0;

  return (
    <div style={{ paddingTop: "54px", padding: "54px 4px 0" }}>
      <div style={{ position: "relative" }}>
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              top: "-56px",
              left: `${pct}%`,
              transform: "translateX(-50%)",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{
              backgroundColor: "#E0C271",
              color: "#272727",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "22px",
              padding: "6px 14px",
              borderRadius: "20px",
              whiteSpace: "nowrap",
            }}>
              &gt;{sliderValue.toFixed(1).replace(".", ",")}
            </div>
            <div style={{
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "7px solid #E0C271",
            }} />
          </div>
        )}

        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={sliderValue}
          onChange={(e) => {
            const v = parseFloat(parseFloat(e.target.value).toFixed(1));
            onChange(v === 0 ? null : v);
          }}
          className="demand-slider"
          style={{
            width: "100%",
            background: `linear-gradient(to right, #E0C271 0%, #E0C271 ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`,
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        {["Qualquer", "★ 1,0", "★ 2,0", "★ 3,0", "★ 4,0", "★ 5,0"].map((l) => (
          <span key={l} style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "20px", color: "#666" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── WorkerCard ───────────────────────────────────────────────────────────────

function WorkerCard({ worker }: { worker: Worker }) {
  const dotColor = availabilityColor[worker.availability];
  const availLabel = availabilityLabel[worker.availability];
  const mediaScrollRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <div
      style={{
        flexShrink: 0,
        width: "700px",
        height: "400px",
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
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Row 1: perfil + nome + rating */}
      <div style={{ position: "absolute", top: "15px", left: "30px", width: "60px", height: "60px" }}>
        <Image src="/images/profile_explore.svg" alt={worker.name} width={60} height={60} style={{ display: "block" }} />
      </div>
      <div style={{ position: "absolute", top: "15px", left: "105px", right: "130px" }}>
        <div style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "30px", color: "#272727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1 }}>
          {worker.name}
        </div>
        <div style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#535353", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1 }}>
          {worker.role} • {worker.city}
        </div>
      </div>
      <div style={{ position: "absolute", top: "15px", right: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "30px", color: "#272727", lineHeight: 1 }}>
          {worker.rating.toFixed(1)}
        </span>
        <Image src="/images/review.svg" alt="Avaliação" width={20} height={20} />
      </div>

      {/* Row 2: mídia */}
      <div
        ref={mediaScrollRef}
        style={{ position: "absolute", top: "104px", left: 0, right: 0, height: "160px", overflowX: "auto", overflowY: "hidden", display: "flex", gap: "15px", scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: "15px", paddingRight: "15px" }}
        className="media-scroll"
      >
        {worker.media.map((m, i) => (
          <div key={i} className="media-item" style={{ flexShrink: 0, width: "120px", height: "160px", backgroundColor: "#535353", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src={m.type === "video" ? "/images/play.svg" : "/images/picture.svg"} alt={m.type} width={m.type === "video" ? 50 : 58} height={50} style={{ display: "block" }} />
          </div>
        ))}
      </div>

      {/* Row 3: tags */}
      <div style={{ position: "absolute", top: "294px", left: "30px", right: "30px", display: "flex", flexWrap: "nowrap", gap: "10px", overflow: "hidden" }}>
        {worker.tags.map((tag) => (
          <span key={tag} style={{ padding: "5px 16px", backgroundColor: "#8E8D8C", borderRadius: "30px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#FAF9F5", whiteSpace: "nowrap", lineHeight: 1.2 }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Row 4: distância + disponibilidade */}
      <div style={{ position: "absolute", top: "340px", left: "30px", right: "30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Image src="/images/location.svg" alt="Distância" width={22} height={25} style={{ display: "block" }} />
          <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#535353", lineHeight: 1 }}>
            {worker.distance}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: dotColor, lineHeight: 1 }}>
            {availLabel}
          </span>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          width: "900px",
          borderRadius: "40px",
          backgroundColor: "rgba(39, 39, 39, 0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "4px solid #C3A85E",
          boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "70px 80px",
        }}
      >
        {/* Ícone de busca vazia */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "rgba(195,168,94,0.15)",
            border: "3px solid #C3A85E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C3A85E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>

        <p
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 600,
            fontSize: "50px",
            color: "#E0C271",
            margin: 0,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Nenhum profissional encontrado
        </p>
        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "28px",
            color: "#C8C7C5",
            margin: 0,
            marginBottom: "50px",
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: "640px",
          }}
        >
          Não encontramos profissionais com os critérios selecionados. Tente
          ampliar a distância, ajustar a disponibilidade ou reduzir a reputação
          mínima.
        </p>

        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "380px",
            height: "70px",
            borderRadius: "60px",
            backgroundColor: "#E0C271",
            border: "none",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "30px",
            color: "#272727",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.04)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Ajustar filtros
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function DemandPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("form");
  const [results, setResults] = useState<Worker[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profError, setProfError] = useState(false);

  const [form, setForm] = useState<FormState>({
    profession: "",
    specialties: [],
    maxKm: null,
    availability: "",
    minRating: null,
  });

  const selectedProfession = PROFESSIONS.find((p) => p.value === form.profession);

  // Handlers
  const setProfession = (value: string) => {
    setProfError(false);
    setForm((f) => ({
      ...f,
      profession: f.profession === value ? "" : value,
      specialties: [],
    }));
  };

  const setSpecialty = (value: string) =>
    setForm((f) => ({
      ...f,
      specialties: f.specialties.includes(value)
        ? f.specialties.filter((s) => s !== value)
        : [...f.specialties, value],
    }));

  const setMaxKm = (km: number | null) =>
    setForm((f) => ({ ...f, maxKm: km }));

  const setAvailability = (key: AvailabilityKey) =>
    setForm((f) => ({
      ...f,
      availability: f.availability === key ? "" : key,
    }));

  const setMinRating = (rating: number | null) =>
    setForm((f) => ({ ...f, minRating: rating }));

  const handleSearch = () => {
    if (!form.profession) {
      setProfError(true);
      setTimeout(() => setProfError(false), 600);
      return;
    }
    setView("searching");
    // Simula chamada à API
    setTimeout(() => {
      setResults(filterWorkers(ALL_WORKERS, form));
      setView("results");
    }, 1800);
  };

  const profLabel =
    PROFESSIONS.find((p) => p.value === form.profession)?.label ?? "";

  // ── Menu lateral (igual ao explore) ────────────────────────────────────────
  const menuItems = [
    { icon: "message.svg", iconW: 42, iconH: 40, label: "Mensagens", href: "/messages" },
    { icon: "settings.svg", iconW: 40, iconH: 40, label: "Configurações", href: "/settings" },
    { icon: "mode.svg", iconW: 40, iconH: 40, label: "Modo escuro", hasSwitch: true, href: null },
    { icon: "help.svg", iconW: 40, iconH: 40, label: "Ajuda", href: null },
    { icon: "logout.svg", iconW: 40, iconH: 40, label: "Sair da conta", href: null },
  ];

  return (
    <div
      className="demand-page-root"
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
        /* Media scroll */
        .media-scroll::-webkit-scrollbar { display: none; }
        .media-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .media-item { transition: background-color 0.2s; }

        /* Cards row */
        .cards-row::-webkit-scrollbar { display: none; }
        .cards-row { -ms-overflow-style: none; scrollbar-width: none; }

        /* Results scroll */
        .results-scroll { overflow-y: auto; overflow-x: hidden; }

        /* Scrollbar customizado — estilo transparente igual ao card glass */
        .demand-page-root::-webkit-scrollbar,
        .results-scroll::-webkit-scrollbar { width: 6px; }

        .demand-page-root::-webkit-scrollbar-track,
        .results-scroll::-webkit-scrollbar-track {
          background: rgba(39,39,39,0.15);
          border-radius: 3px;
          margin: 20px 0;
        }
        .demand-page-root::-webkit-scrollbar-thumb,
        .results-scroll::-webkit-scrollbar-thumb {
          background: rgba(195,168,94,0.45);
          border-radius: 3px;
        }
        .demand-page-root::-webkit-scrollbar-thumb:hover,
        .results-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(195,168,94,0.75);
        }
        .demand-page-root { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.15); }
        .results-scroll  { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.15); }

        /* Slider customizado */
        .demand-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
          border: none;
          display: block;
        }
        .demand-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FAF9F5;
          border: 3px solid #E0C271;
          cursor: grab;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
          transition: transform 0.1s ease;
        }
        .demand-slider:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.18);
        }
        .demand-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FAF9F5;
          border: 3px solid #E0C271;
          cursor: grab;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        /* Menu */
        .demand-menu-panel {
          position: fixed;
          top: 90px;
          right: 0;
          width: 520px;
          height: calc(100vh - 90px);
          border-radius: 40px 0 0 40px;
          background-color: rgba(39, 39, 39, 0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.28);
          z-index: 99;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
          overflow: hidden;
        }
        .demand-menu-panel.open { transform: translateX(0); }

        /* Profissão shake */
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-8px); }
          80%      { transform: translateX(8px); }
        }
        .shake { animation: shake 0.45s ease; }

        /* Loading dots */
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-20px); opacity: 1; }
        }
        .dot1 { animation: bounce 1.4s ease-in-out infinite; }
        .dot2 { animation: bounce 1.4s ease-in-out 0.2s infinite; }
        .dot3 { animation: bounce 1.4s ease-in-out 0.4s infinite; }

        /* Fade in para resultados */
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeSlideIn 0.5s ease forwards; }
      `}</style>

      {/* ── CABEÇALHO ──────────────────────────────────────────────────────── */}
      <header
        style={{
          width: "100%",
          height: "90px",
          backgroundColor: "#E0C271",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ position: "absolute", top: "15px", left: "40px", zIndex: 20 }}>
          <Image src="/images/logo_domi.svg" alt="Logo DOMI" width={70} height={60} style={{ display: "block" }} />
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
          style={{ display: "block", marginLeft: "60px", marginRight: "80px", cursor: "pointer" }}
        />
      </header>

      {/* ── OVERLAY menu ───────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 98 }}
        />
      )}

      {/* ── GLASS MENU PANEL ───────────────────────────────────────────────── */}
      <div className={`demand-menu-panel${menuOpen ? " open" : ""}`}>
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
          const firstLineTop = 145;
          const rowHeight = 90;
          return (
            <>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`line-${i}`}
                  style={{
                    position: "absolute",
                    left: 0,
                    width: "520px",
                    height: "2px",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    top: `${firstLineTop + i * rowHeight}px`,
                  }}
                />
              ))}
              {menuItems.map((item, i) => {
                const centerY = firstLineTop + i * rowHeight + rowHeight / 2;
                return (
                  <div
                    key={item.label}
                    onClick={() => { if (item.href) router.push(item.href); }}
                    style={{
                      position: "absolute",
                      top: `${centerY}px`,
                      transform: "translateY(-50%)",
                      left: "40px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      cursor: "hasSwitch" in item && item.hasSwitch ? "default" : "pointer",
                    }}
                  >
                    <Image src={`/images/${item.icon}`} alt={item.label} width={item.iconW} height={item.iconH} style={{ flexShrink: 0 }} />
                    <span
                      style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "40px", color: "#FAF9F5", userSelect: "none", transition: "text-decoration 0.15s" }}
                      onMouseEnter={(e) => { if (!("hasSwitch" in item && item.hasSwitch)) e.currentTarget.style.textDecoration = "underline"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                    >
                      {item.label}
                    </span>
                    {"hasSwitch" in item && item.hasSwitch && (
                      <div
                        onClick={(e) => { e.stopPropagation(); setDarkMode((v) => !v); }}
                        style={{ marginLeft: "60px", width: "80px", height: "40px", borderRadius: "20px", backgroundColor: darkMode ? "#E0C271" : "#C3C3C3", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background-color 0.3s ease" }}
                      >
                        <div
                          style={{ position: "absolute", top: "50%", left: darkMode ? "calc(100% - 37px)" : "4px", transform: "translateY(-50%)", width: "33px", height: "33px", borderRadius: "50%", backgroundColor: "#FAF9F5", transition: "left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
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

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ESTADO: FORMULÁRIO                                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {view === "form" && (
        <div
          style={{
            paddingTop: "50px",
            paddingBottom: "80px",
            paddingLeft: "105px",
            paddingRight: "105px",
          }}
        >
          {/* ── Título ── */}
          <div style={{ marginBottom: "40px" }}>
            <div
              onClick={() => router.push("/home")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "28px",
                fontWeight: 500,
                color: "#535353",
                cursor: "pointer",
                marginBottom: "24px",
                userSelect: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
            >
              ← Voltar
            </div>
            <h1
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: "90px",
                color: "#E0C271",
                lineHeight: 1,
                margin: 0,
                marginBottom: "10px",
                letterSpacing: "-2px",
              }}
            >
              Demanda Inteligente
            </h1>
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: "32px",
                color: "#535353",
                margin: 0,
              }}
            >
              Defina seus critérios e encontre o profissional ideal para você.
            </p>
          </div>

          {/* ── Card do formulário ── */}
          <div
            style={{
              width: "100%",
              maxWidth: "1710px",
              borderRadius: "40px",
              backgroundColor: "rgba(39, 39, 39, 0.88)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "4px solid #C3A85E",
              boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
              padding: "55px 65px",
              boxSizing: "border-box",
            }}
          >

            {/* ── SEÇÃO 1: Profissional ── */}
            <div className={profError ? "shake" : ""}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "40px",
                    borderRadius: "5px",
                    backgroundColor: profError ? "#D92B2E" : "#E0C271",
                    flexShrink: 0,
                    transition: "background-color 0.3s",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "36px",
                    color: profError ? "#D92B2E" : "#FAF9F5",
                    margin: 0,
                    transition: "color 0.3s",
                  }}
                >
                  Profissional{" "}
                  <span style={{ fontWeight: 300, fontSize: "28px", color: profError ? "#D92B2E" : "#888" }}>
                    {profError ? "— selecione uma categoria" : "— obrigatório"}
                  </span>
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                {PROFESSIONS.map((p) => (
                  <Chip
                    key={p.value}
                    label={p.label}
                    selected={form.profession === p.value}
                    onToggle={() => setProfession(p.value)}
                  />
                ))}
              </div>
            </div>

            {/* ── SEÇÃO 2: Especialidade ── */}
            {selectedProfession && (
              <>
                <SectionDivider />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ width: "10px", height: "40px", borderRadius: "5px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "36px", color: "#FAF9F5", margin: 0 }}>
                      Especialidade{" "}
                      <span style={{ fontWeight: 300, fontSize: "28px", color: "#888" }}>— opcional</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                    {selectedProfession.specialties.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        selected={form.specialties.includes(s)}
                        onToggle={() => setSpecialty(s)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <SectionDivider />

            {/* ── SEÇÃO 3: Localização ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
                <div style={{ width: "10px", height: "40px", borderRadius: "5px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "36px", color: "#FAF9F5", margin: 0 }}>
                  Localização{" "}
                  <span style={{ fontWeight: 300, fontSize: "28px", color: "#888" }}>— opcional</span>
                </p>
              </div>
              <LocationSlider value={form.maxKm} onChange={setMaxKm} />
            </div>

            <SectionDivider />

            {/* ── SEÇÃO 4: Disponibilidade ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{ width: "10px", height: "40px", borderRadius: "5px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "36px", color: "#FAF9F5", margin: 0 }}>
                  Disponibilidade{" "}
                  <span style={{ fontWeight: 300, fontSize: "28px", color: "#888" }}>— opcional</span>
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                {(
                  [
                    { label: "Disponível hoje", value: "hoje" },
                    { label: "Disponível amanhã", value: "amanha" },
                    { label: "Esta semana", value: "semana" },
                    { label: "Próximos 15 dias", value: "quinze" },
                    { label: "Este mês", value: "mes" },
                  ] as { label: string; value: AvailabilityKey }[]
                ).map(({ label, value }) => (
                  <Chip
                    key={value}
                    label={label}
                    selected={form.availability === value}
                    onToggle={() => setAvailability(value)}
                  />
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* ── SEÇÃO 5: Reputação ── */}
            <div style={{ marginBottom: "50px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
                <div style={{ width: "10px", height: "40px", borderRadius: "5px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "36px", color: "#FAF9F5", margin: 0 }}>
                  Reputação mínima{" "}
                  <span style={{ fontWeight: 300, fontSize: "28px", color: "#888" }}>— opcional</span>
                </p>
              </div>
              <RatingSlider value={form.minRating} onChange={setMinRating} />
            </div>

            {/* ── Botão confirmar ── */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSearch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "16px",
                  width: "520px",
                  height: "80px",
                  borderRadius: "60px",
                  backgroundColor: "#E0C271",
                  border: "none",
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "36px",
                  color: "#272727",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  userSelect: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Encontrar profissionais
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#272727" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ESTADO: BUSCANDO                                                      */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {view === "searching" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 90px)",
          }}
        >
          {/* Logo pulsante */}
          <div
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              backgroundColor: "rgba(224,194,113,0.12)",
              border: "4px solid #E0C271",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "50px",
            }}
          >
            <Image src="/images/logo_domi.svg" alt="DOMI" width={80} height={68} />
          </div>

          <p
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 600,
              fontSize: "55px",
              color: "#272727",
              margin: 0,
              marginBottom: "20px",
              letterSpacing: "-1px",
            }}
          >
            Procurando profissionais
          </p>
          <p
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "28px",
              color: "#535353",
              margin: 0,
              marginBottom: "50px",
            }}
          >
            Analisando {profLabel ? profLabel.toLowerCase() + "s" : "profissionais"} disponíveis para você...
          </p>

          {/* Dots animados */}
          <div style={{ display: "flex", gap: "18px" }}>
            {["dot1", "dot2", "dot3"].map((cls) => (
              <div
                key={cls}
                className={cls}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#E0C271",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ESTADO: RESULTADOS                                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {view === "results" && (
        <div className="fade-in results-scroll" style={{ height: "calc(100vh - 90px)", paddingBottom: "80px" }}>

          {/* ── Header dos resultados ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingLeft: "105px",
              paddingRight: "105px",
              paddingTop: "45px",
              paddingBottom: "40px",
            }}
          >
            <div>
              <div
                onClick={() => setView("form")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "28px",
                  fontWeight: 500,
                  color: "#535353",
                  cursor: "pointer",
                  marginBottom: "18px",
                  userSelect: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
              >
                ← Ajustar filtros
              </div>

              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 600,
                  fontSize: "70px",
                  color: "#E0C271",
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: "-1.5px",
                }}
              >
                {profLabel}
              </h2>

              {/* Resumo dos filtros aplicados */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
                {form.specialties.map((s) => (
                  <span key={s} style={{ padding: "6px 20px", backgroundColor: "rgba(224,194,113,0.15)", border: "1.5px solid #E0C271", borderRadius: "30px", fontSize: "24px", color: "#E0C271" }}>
                    {s}
                  </span>
                ))}
                {form.maxKm !== null && (
                  <span style={{ padding: "6px 20px", backgroundColor: "rgba(224,194,113,0.15)", border: "1.5px solid #E0C271", borderRadius: "30px", fontSize: "24px", color: "#E0C271" }}>
                    Até {form.maxKm} km
                  </span>
                )}
                {form.availability && (
                  <span style={{ padding: "6px 20px", backgroundColor: "rgba(224,194,113,0.15)", border: "1.5px solid #E0C271", borderRadius: "30px", fontSize: "24px", color: "#E0C271" }}>
                    {availabilityLabel[form.availability as AvailabilityKey]}
                  </span>
                )}
                {form.minRating !== null && (
                  <span style={{ padding: "6px 20px", backgroundColor: "rgba(224,194,113,0.15)", border: "1.5px solid #E0C271", borderRadius: "30px", fontSize: "24px", color: "#E0C271" }}>
                    ★ {form.minRating.toFixed(1)}+
                  </span>
                )}
              </div>
            </div>

            {/* Contador de resultados */}
            {results.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  paddingTop: "48px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 700,
                    fontSize: "80px",
                    color: "#272727",
                    lineHeight: 1,
                  }}
                >
                  {results.length}
                </span>
                <span
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "28px",
                    color: "#535353",
                  }}
                >
                  {results.length === 1 ? "profissional encontrado" : "profissionais encontrados"}
                </span>
              </div>
            )}
          </div>

          {/* ── Conteúdo: cards ou empty state ── */}
          {results.length === 0 ? (
            <div style={{ paddingLeft: "105px", paddingRight: "105px" }}>
              <EmptyState onBack={() => setView("form")} />
            </div>
          ) : (
            <div
              className="cards-row"
              style={{
                display: "flex",
                gap: "30px",
                overflowX: "auto",
                paddingLeft: "105px",
                paddingRight: "105px",
                paddingBottom: "12px",
              }}
            >
              {results.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
