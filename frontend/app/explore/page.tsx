"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";
import { apiClient } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type Availability = "hoje" | "amanha" | "semana" | "quinze" | "mes" | "indisponivel";
type SortKey = "relevancia" | "mais_proximo" | "melhor_avaliado" | "disponivel_primeiro";

interface MediaItem { type: "photo" | "video" }

interface Worker {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  media: MediaItem[];
  tags: string[];
  distance: string;
  distanceKm: number;
  availability: Availability;
}

interface Category {
  label: string;
  workers: Worker[];
}

interface FilterState {
  specialties: string[];
  maxKm: number | null;
  availability: Availability | "";
  minRating: number | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_KM = 50;

const availabilityLabel: Record<Availability, string> = {
  hoje: "Disponível hoje",
  amanha: "Disponível amanhã",
  semana: "Esta semana",
  quinze: "Próximos 15 dias",
  mes: "Este mês",
  indisponivel: "Indisponível",
};

const availabilityColor: Record<Availability, string> = {
  hoje: "#3DBD7D",
  amanha: "#F5A623",
  semana: "#F5A623",
  quinze: "#F5A623",
  mes: "#F5A623",
  indisponivel: "#AAAAAA",
};

const avPriority: Record<Availability | "", number> = {
  "": 0,
  indisponivel: 1,
  mes: 2,
  quinze: 3,
  semana: 4,
  amanha: 5,
  hoje: 6,
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevancia",          label: "Relevância" },
  { key: "mais_proximo",        label: "Mais próximo" },
  { key: "melhor_avaliado",     label: "Melhor avaliado" },
  { key: "disponivel_primeiro", label: "Disponível primeiro" },
];

// ─── API types ────────────────────────────────────────────────────────────────

interface ExploreCard {
  user_id: string;
  nome: string;
  score: number;
  foto_url: string | null;
  cidade: string | null;
  estado: string | null;
  portfolio: { url: string; tipo: string; ordem: number }[];
  tags: string[];
}

interface ExploreCategoria {
  categoria_id: string;
  categoria: string;
  prestadores: ExploreCard[];
}

function mapApiToCategories(data: ExploreCategoria[]): Category[] {
  return data.map((cat) => ({
    label: cat.categoria,
    workers: cat.prestadores.map((card) => ({
      id: card.user_id,
      name: card.nome,
      role: cat.categoria,
      city: [card.cidade, card.estado].filter(Boolean).join(", ") || "Brasil",
      rating: Math.min(5, Math.max(0, card.score ?? 0)),
      media: card.portfolio.length > 0
        ? card.portfolio.map((p) => ({ type: (p.tipo === "video" ? "video" : "photo") as "photo" | "video" }))
        : [{ type: "photo" as const }],
      tags: card.tags,
      distance: "—",
      distanceKm: 0,
      availability: "hoje" as Availability,
    })),
  }));
}

// ─── Filter & Sort ────────────────────────────────────────────────────────────

function applyFiltersAndSort(
  categories: Category[],
  filters: FilterState,
  sort: SortKey
): Category[] {
  return categories
    .map((cat) => {
      let workers = cat.workers.filter((w) => {
        if (filters.specialties.length > 0 && !filters.specialties.some((s) => w.tags.includes(s))) return false;
        if (filters.maxKm !== null && w.distanceKm > filters.maxKm) return false;
        if (filters.availability && avPriority[w.availability] < avPriority[filters.availability]) return false;
        if (filters.minRating !== null && w.rating < filters.minRating) return false;
        return true;
      });
      if (sort === "mais_proximo")        workers = [...workers].sort((a, b) => a.distanceKm - b.distanceKm);
      else if (sort === "melhor_avaliado") workers = [...workers].sort((a, b) => b.rating - a.rating);
      else if (sort === "disponivel_primeiro") workers = [...workers].sort((a, b) => avPriority[b.availability] - avPriority[a.availability]);
      return { ...cat, workers };
    })
    .filter((cat) => cat.workers.length > 0);
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
      style={{ flexShrink: 0, width: "700px", height: "400px", backgroundColor: "#FAF9F5", border: "6px solid #E0C271", borderRadius: "40px", boxSizing: "border-box", cursor: "pointer", position: "relative", overflow: "hidden", transition: "box-shadow 0.18s, transform 0.18s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(224,194,113,0.35)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: "15px", left: "30px", width: "60px", height: "60px" }}>
        <Image src="/images/profile_explore.svg" alt={worker.name} width={60} height={60} style={{ display: "block" }} />
      </div>
      <div style={{ position: "absolute", top: "15px", left: "105px", right: "130px" }}>
        <div style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "30px", color: "#272727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1 }}>{worker.name}</div>
        <div style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#535353", marginTop: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1 }}>{worker.role} • {worker.city}</div>
      </div>
      <div style={{ position: "absolute", top: "15px", right: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "30px", color: "#272727", lineHeight: 1 }}>{worker.rating.toFixed(1)}</span>
        <Image src="/images/review.svg" alt="Avaliação" width={20} height={20} />
      </div>
      <div style={{ position: "absolute", top: "104px", left: 0, right: 0, height: "160px", overflowX: "auto", overflowY: "hidden", display: "flex", gap: "15px", scrollbarWidth: "none", msOverflowStyle: "none", paddingLeft: "15px", paddingRight: "15px" } as React.CSSProperties} ref={mediaScrollRef} className="media-scroll">
        {worker.media.map((m, i) => (
          <div key={i} style={{ flexShrink: 0, width: "120px", height: "160px", backgroundColor: "#535353", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" }} className="media-item">
            <Image src={m.type === "video" ? "/images/play.svg" : "/images/picture.svg"} alt={m.type} width={m.type === "video" ? 50 : 58} height={50} style={{ display: "block" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: "294px", left: "30px", right: "30px", display: "flex", flexWrap: "nowrap", gap: "10px", overflow: "hidden" }}>
        {worker.tags.map((tag) => (
          <span key={tag} style={{ padding: "5px 16px", backgroundColor: "#8E8D8C", borderRadius: "30px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#FAF9F5", whiteSpace: "nowrap", lineHeight: 1.2 }}>{tag}</span>
        ))}
      </div>
      <div style={{ position: "absolute", top: "340px", left: "30px", right: "30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Image src="/images/location.svg" alt="Distância" width={22} height={25} style={{ display: "block" }} />
          <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#535353", lineHeight: 1 }}>{worker.distance}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: dotColor, lineHeight: 1 }}>{availLabel}</span>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ─── LocationSlider ───────────────────────────────────────────────────────────

function LocationSlider({ value, onChange }: { value: number | null; onChange: (km: number | null) => void }) {
  const sliderValue = value === null ? MAX_KM : value;
  const isAny = value === null;
  const pct = ((sliderValue - 1) / (MAX_KM - 1)) * 100;

  return (
    <div style={{ padding: "0 4px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "26px", color: isAny ? "#AAAAAA" : "#272727", transition: "color 0.2s" }}>
          {isAny ? "Qualquer distância" : `Até ${sliderValue} km`}
        </span>
        {!isAny && (
          <button onClick={() => onChange(null)} style={{ background: "none", border: "none", color: "#AAAAAA", fontSize: "20px", cursor: "pointer", fontFamily: "'SF Pro Text', system-ui, sans-serif", padding: 0, textDecoration: "underline" }}>
            Limpar
          </button>
        )}
      </div>
      <input
        type="range" min={1} max={MAX_KM} step={1} value={sliderValue}
        onChange={(e) => { const v = parseInt(e.target.value); onChange(v >= MAX_KM ? null : v); }}
        className="explore-slider"
        style={{ width: "100%", background: `linear-gradient(to right, #E0C271 0%, #E0C271 ${pct}%, rgba(39,39,39,0.15) ${pct}%, rgba(39,39,39,0.15) 100%)` }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        {["1 km", "15 km", "30 km", "50 km+"].map((l) => (
          <span key={l} style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "18px", color: "#AAAAAA" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── RatingSlider ─────────────────────────────────────────────────────────────

function RatingSlider({ value, onChange }: { value: number | null; onChange: (rating: number | null) => void }) {
  const sliderValue = value === null ? 0 : value;
  const pct = (sliderValue / 5) * 100;

  return (
    <div style={{ paddingTop: "48px" }}>
      <div style={{ position: "relative" }}>
        {sliderValue > 0 && (
          <div style={{ position: "absolute", top: "-52px", left: `${pct}%`, transform: "translateX(-50%)", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ backgroundColor: "#272727", color: "#FAF9F5", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "20px", padding: "5px 12px", borderRadius: "16px", whiteSpace: "nowrap" }}>
              &gt;{sliderValue.toFixed(1).replace(".", ",")}
            </div>
            <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #272727" }} />
          </div>
        )}
        <input
          type="range" min={0} max={5} step={0.1} value={sliderValue}
          onChange={(e) => { const v = parseFloat(parseFloat(e.target.value).toFixed(1)); onChange(v === 0 ? null : v); }}
          className="explore-slider"
          style={{ width: "100%", background: `linear-gradient(to right, #E0C271 0%, #E0C271 ${pct}%, rgba(39,39,39,0.15) ${pct}%, rgba(39,39,39,0.15) 100%)` }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        {["Qualquer", "★ 1,0", "★ 2,0", "★ 3,0", "★ 4,0", "★ 5,0"].map((l) => (
          <span key={l} style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "18px", color: "#AAAAAA" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

function FilterChip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <div
      onClick={onToggle}
      style={{ padding: "10px 22px", border: `2px solid ${selected ? "#272727" : "#DEDEDE"}`, borderRadius: "30px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: selected ? 600 : 400, fontSize: "22px", color: selected ? "#FAF9F5" : "#535353", backgroundColor: selected ? "#272727" : "#FFFFFF", cursor: "pointer", userSelect: "none", transition: "all 0.15s", whiteSpace: "nowrap" as const, flexShrink: 0 }}
    >
      {label}
    </div>
  );
}

// ─── FilterModal ──────────────────────────────────────────────────────────────

function FilterModal({
  open,
  filters,
  onChange,
  onClose,
  allSpecialties,
}: {
  open: boolean;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
  allSpecialties: string[];
}) {
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSpecialty = (s: string) =>
    setLocal((f) => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter((x) => x !== s) : [...f.specialties, s],
    }));

  const handleApply = () => { onChange(local); onClose(); };
  const handleClear = () => setLocal({ specialties: [], maxKm: null, availability: "", minRating: null });

  if (!open) return null;

  const Divider = () => <div style={{ width: "100%", height: "1.5px", backgroundColor: "rgba(195,168,94,0.35)", margin: "24px 0" }} />;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }} />
      <div
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#FAF9F5", borderRadius: "40px 40px 0 0", padding: "30px 50px 60px", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.3s cubic-bezier(0.25,0.8,0.25,1)" }}
      >
        <style>{`
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          .explore-slider { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 3px; outline: none; cursor: pointer; border: none; display: block; width: 100%; }
          .explore-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%; background: #272727; border: 3px solid #E0C271; cursor: grab; box-shadow: 0 2px 8px rgba(0,0,0,0.25); transition: transform 0.1s ease; }
          .explore-slider:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.18); }
          .explore-slider::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: #272727; border: 3px solid #E0C271; cursor: grab; }
        `}</style>

        <div style={{ width: "60px", height: "6px", background: "#DEDEDE", borderRadius: "3px", margin: "0 auto 30px" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "36px", color: "#272727", margin: 0 }}>Filtrar</p>
          <button onClick={handleClear} style={{ background: "none", border: "none", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "22px", color: "#AAAAAA", cursor: "pointer", textDecoration: "underline" }}>Limpar tudo</button>
        </div>

        {/* Especialidade */}
        <div>
          <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "20px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Especialidade</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {allSpecialties.map((s) => (
              <FilterChip key={s} label={s} selected={local.specialties.includes(s)} onToggle={() => toggleSpecialty(s)} />
            ))}
          </div>
        </div>

        <Divider />

        {/* Localização */}
        <div>
          <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "20px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Localização</p>
          <LocationSlider value={local.maxKm} onChange={(maxKm) => setLocal((f) => ({ ...f, maxKm }))} />
        </div>

        <Divider />

        {/* Disponibilidade */}
        <div>
          <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "20px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>Disponibilidade</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {(["hoje", "amanha", "semana", "quinze", "mes"] as Availability[]).map((key) => (
              <FilterChip
                key={key}
                label={availabilityLabel[key]}
                selected={local.availability === key}
                onToggle={() => setLocal((f) => ({ ...f, availability: f.availability === key ? "" : key }))}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* Reputação */}
        <div style={{ marginBottom: "12px" }}>
          <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "20px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Reputação mínima</p>
          <RatingSlider value={local.minRating} onChange={(minRating) => setLocal((f) => ({ ...f, minRating }))} />
        </div>

        <button
          onClick={handleApply}
          style={{ width: "100%", marginTop: "24px", padding: "22px", background: "#E0C271", border: "none", borderRadius: "20px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "28px", color: "#272727", cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}

// ─── SortModal ────────────────────────────────────────────────────────────────

function SortModal({
  open,
  sort,
  onChange,
  onClose,
}: {
  open: boolean;
  sort: SortKey;
  onChange: (s: SortKey) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<SortKey>(sort);

  useEffect(() => { if (open) setLocal(sort); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#FAF9F5", borderRadius: "40px 40px 0 0", padding: "30px 50px 60px", animation: "slideUp 0.3s cubic-bezier(0.25,0.8,0.25,1)" }}>
        <div style={{ width: "60px", height: "6px", background: "#DEDEDE", borderRadius: "3px", margin: "0 auto 30px" }} />
        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "36px", color: "#272727", marginBottom: "20px" }}>Ordenar por</p>
        <div style={{ borderRadius: "20px", overflow: "hidden", border: "1.5px solid #DEDEDE" }}>
          {SORT_OPTIONS.map((opt, i) => {
            const isSelected = local === opt.key;
            const isLast = i === SORT_OPTIONS.length - 1;
            return (
              <div
                key={opt.key}
                onClick={() => setLocal(opt.key)}
                style={{ padding: "22px 28px", borderBottom: isLast ? "none" : "1.5px solid #DEDEDE", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: isSelected ? 600 : 400, fontSize: "26px", color: isSelected ? "#272727" : "#535353", backgroundColor: isSelected ? "#FDF6E3" : "#FFFFFF", cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background-color 0.15s" }}
              >
                {opt.label}
                {isSelected && <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#E0C271" }} />}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => { onChange(local); onClose(); }}
          style={{ width: "100%", marginTop: "24px", padding: "22px", background: "#E0C271", border: "none", borderRadius: "20px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "28px", color: "#272727", cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
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

  const handleLogout = () => { logout(); router.push("/"); };

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [filters, setFilters] = useState<FilterState>({
    specialties: [],
    maxKm: null,
    availability: "",
    minRating: null,
  });

  const [apiCategories, setApiCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    apiClient.get<ExploreCategoria[]>("/explore")
      .then((data) => setApiCategories(mapApiToCategories(data)))
      .catch(() => setApiCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  const allSpecialties = useMemo(
    () => Array.from(new Set(apiCategories.flatMap((c) => c.workers.flatMap((w) => w.tags)))).sort(),
    [apiCategories]
  );

  const activeFilterCount = [
    filters.specialties.length > 0,
    filters.maxKm !== null,
    filters.availability !== "",
    filters.minRating !== null,
  ].filter(Boolean).length;

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Ordenar";

  const visibleCategories = useMemo(
    () => applyFiltersAndSort(apiCategories, filters, sort),
    [apiCategories, filters, sort]
  );

  return (
    <div
      style={{ width: "100%", minHeight: "100vh", overflow: "hidden", position: "relative", backgroundColor: "#FAF9F5", fontFamily: "'SF Pro Text', system-ui, sans-serif" }}
    >
      <style>{`
        .menu-panel {
          position: absolute; top: 90px; right: 0; width: 520px; height: calc(100vh - 90px);
          border-radius: 40px 0 0 40px; background-color: rgba(39,39,39,0.82);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.28); z-index: 99; overflow: hidden;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.645,0.045,0.355,1);
        }
        .menu-panel.open { transform: translateX(0); }
        .media-scroll::-webkit-scrollbar { display: none; }
        .media-scroll { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .media-item { scroll-snap-align: start; transition: background-color 0.2s; }
        .cards-row::-webkit-scrollbar { display: none; }
        .cards-row { -ms-overflow-style: none; scrollbar-width: none; }
        .results-scroll { overflow-y: auto; overflow-x: hidden; }
        .results-scroll::-webkit-scrollbar { width: 6px; }
        .results-scroll::-webkit-scrollbar-track { background: rgba(39,39,39,0.08); border-radius: 3px; margin: 16px 0; }
        .results-scroll::-webkit-scrollbar-thumb { background: rgba(195,168,94,0.45); border-radius: 3px; }
        .results-scroll::-webkit-scrollbar-thumb:hover { background: rgba(195,168,94,0.75); }
        .results-scroll { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.08); }
      `}</style>

      {/* ── CABEÇALHO ── */}
      <header style={{ width: "100%", height: "90px", backgroundColor: "#E0C271", display: "flex", alignItems: "center", position: "relative", zIndex: 10, marginBottom: "35px" }}>
        <div style={{ position: "absolute", top: "15px", left: "40px", zIndex: 20 }}>
          <Image src="/images/logo_domi.svg" alt="Logo DOMI" width={70} height={60} style={{ display: "block" }} />
        </div>
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", lineHeight: 1, marginLeft: "130px", letterSpacing: "-1px", userSelect: "none" }}>DOMI</span>
        <div style={{ flex: 1 }} />
        <Image src="/images/profile_notify.svg" alt="Perfil" width={52} height={53} onClick={() => router.push("/profile")} style={{ display: "block", cursor: "pointer" }} />
        <Image src="/images/navy.svg" alt="Menu" width={60} height={50} onClick={() => setMenuOpen((v) => !v)} style={{ display: "block", marginLeft: "60px", marginRight: "80px", cursor: "pointer" }} />
      </header>

      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />}

      {/* ── GLASS MENU PANEL ── */}
      <div className={`menu-panel${menuOpen ? " open" : ""}`}>
        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "50px", color: "#FAF9F5", margin: 0, marginTop: "60px", marginLeft: "40px", lineHeight: 1.1 }}>Olá, Usuário!</p>
        {(() => {
          const firstLineTop = 145;
          const rowHeight = 90;
          const menuItems = [
            { icon: "message.svg", iconW: 42, iconH: 40, label: "Mensagens", hasSwitch: false, href: "/messages" },
            { icon: "settings.svg", iconW: 40, iconH: 40, label: "Configurações", hasSwitch: false, href: null },
            { icon: "mode.svg", iconW: 40, iconH: 40, label: "Modo escuro", hasSwitch: true, href: null },
            { icon: "help.svg", iconW: 40, iconH: 40, label: "Ajuda", hasSwitch: false, href: null },
            { icon: "logout.svg", iconW: 40, iconH: 40, label: "Sair da conta", hasSwitch: false, href: null },
          ];
          return (
            <>
              {[0,1,2,3,4,5].map((i) => (
                <div key={`line-${i}`} style={{ position: "absolute", left: 0, width: "520px", height: "2px", backgroundColor: "#FAF9F5", top: `${firstLineTop + i * rowHeight}px` }} />
              ))}
              {menuItems.map((item, i) => {
                const centerY = firstLineTop + i * rowHeight + rowHeight / 2;
                return (
                  <div key={item.label} onClick={() => { if (item.label === "Sair da conta") handleLogout(); else if (item.href) router.push(item.href); }} style={{ position: "absolute", top: `${centerY}px`, transform: "translateY(-50%)", left: "40px", display: "flex", alignItems: "center", gap: "15px", cursor: item.hasSwitch ? "default" : "pointer" }}>
                    <Image src={`/images/${item.icon}`} alt={item.label} width={item.iconW} height={item.iconH} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "40px", color: "#FAF9F5", userSelect: "none", transition: "text-decoration 0.15s" }} onMouseEnter={(e) => { if (!item.hasSwitch) e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>{item.label}</span>
                    {item.hasSwitch && (
                      <div onClick={(e) => { e.stopPropagation(); setDarkMode((v) => !v); }} style={{ marginLeft: "60px", width: "80px", height: "40px", borderRadius: "20px", backgroundColor: darkMode ? "#E0C271" : "#C3C3C3", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background-color 0.3s ease" }}>
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

      {/* ── BARRA DE PESQUISA ── */}
      <div style={{ position: "relative", marginBottom: "50px" }}>
        <div style={{ display: "flex", alignItems: "center", width: "1710px", height: "80px", backgroundColor: "#EAEAEA", boxShadow: "0px 10px 30px rgba(0,0,0,0.25)", borderRadius: "60px", marginLeft: "105px", paddingLeft: "50px", boxSizing: "border-box", flexShrink: 0 }}>
          <Image src="/images/Lupa.svg" alt="Buscar" width={50} height={50} style={{ flexShrink: 0 }} />
          <input type="text" placeholder="Que serviço você precisa hoje?" style={{ flex: 1, marginLeft: "30px", backgroundColor: "transparent", border: "none", outline: "none", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px", color: "#535353" }} />
        </div>
        <div onClick={() => router.push("/home")} style={{ position: "absolute", top: "calc(100% + 20px)", left: "105px", fontSize: "30px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, color: "#272727", cursor: "pointer", userSelect: "none", zIndex: 5 }} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
          ← Voltar
        </div>
      </div>

      {/* ── ÁREA DE RESULTADOS ── */}
      <div className="results-scroll" style={{ marginTop: "70px", paddingBottom: "80px", height: "calc(100vh - 90px - 35px - 80px - 50px - 70px)" }}>

        {/* Ordenar + Filtrar */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "20px", marginBottom: "50px", paddingRight: "70px", paddingLeft: "40px" }}>
          <div
            onClick={() => setSortOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 32px", backgroundColor: sort !== "relevancia" ? "#FDF6E3" : "#FFFFFF", border: `2px solid ${sort !== "relevancia" ? "#E0C271" : "#DEDEDE"}`, borderRadius: "50px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: sort !== "relevancia" ? 600 : 500, fontSize: "26px", color: "#272727", cursor: "pointer", userSelect: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.07)", transition: "border-color 0.15s, box-shadow 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.07)"; }}
          >
            <Image src="/images/ordenar.svg" alt="Ordenar" width={28} height={28} />
            {currentSortLabel}
          </div>
          <div
            onClick={() => setFilterOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 32px", backgroundColor: activeFilterCount > 0 ? "#FDF6E3" : "#FFFFFF", border: `2px solid ${activeFilterCount > 0 ? "#E0C271" : "#DEDEDE"}`, borderRadius: "50px", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: activeFilterCount > 0 ? 600 : 500, fontSize: "26px", color: "#272727", cursor: "pointer", userSelect: "none", boxShadow: "0 4px 14px rgba(0,0,0,0.07)", transition: "border-color 0.15s, box-shadow 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 14px rgba(0,0,0,0.07)"; }}
          >
            <Image src="/images/filter.svg" alt="Filtrar" width={28} height={28} />
            Filtrar{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </div>
        </div>

        {/* Categorias */}
        {loadingCategories ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px" }}>
            <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "32px", color: "#8E8D8C", margin: 0 }}>Carregando profissionais...</p>
          </div>
        ) : visibleCategories.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "60px", gap: "16px" }}>
            <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "32px", color: "#8E8D8C", margin: 0 }}>
              {apiCategories.length === 0 ? "Nenhum profissional cadastrado ainda." : "Nenhum profissional encontrado com os filtros aplicados."}
            </p>
            {apiCategories.length > 0 && (
              <button onClick={() => setFilters({ specialties: [], maxKm: null, availability: "", minRating: null })} style={{ padding: "14px 36px", borderRadius: "30px", backgroundColor: "#E0C271", border: "none", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "26px", color: "#272727", cursor: "pointer" }}>Limpar filtros</button>
            )}
          </div>
        ) : (
          visibleCategories.map((category) => (
            <div key={category.label} style={{ marginBottom: "60px" }}>
              <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "40px", color: "#272727", margin: 0, marginBottom: "15px", paddingLeft: "40px" }}>{category.label}</p>
              <div className="cards-row" style={{ display: "flex", gap: "30px", overflowX: "auto", paddingLeft: "40px", paddingRight: "70px", paddingBottom: "8px", boxSizing: "content-box" }}>
                {category.workers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <FilterModal open={filterOpen} filters={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} allSpecialties={allSpecialties} />
      <SortModal open={sortOpen} sort={sort} onChange={setSort} onClose={() => setSortOpen(false)} />
    </div>
  );
}
