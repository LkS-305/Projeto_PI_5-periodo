"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ClientGateway, type ExploreCategoria } from "@/lib/gateways/ClientGateway";
import { ROUTES } from "@/lib/routes";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import "./explore.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type Availability = "hoje" | "amanha" | "semana" | "quinze" | "mes" | "indisponivel";
type SortKey = "relevancia" | "mais_proximo" | "melhor_avaliado" | "disponivel_primeiro";

interface MediaItem {
  type: "photo" | "video";
  url?: string;
}

interface Worker {
  /** Chave estável para lista (categoria + prestador) */
  id: string;
  prestadorUserId: string;
  categoriaId: string;
  name: string;
  role: string;
  city: string;
  rating: number;
  media: MediaItem[];
  tags: string[];
  distance: string;
  distanceKm: number;
  availability: Availability;
  fotoUrl?: string | null;
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

/** Cor de destaque por categoria (bolinha, borda, fundo suave). */
const PROFESSION_ACCENTS = [
  { border: "#5B8DEF", dot: "#5B8DEF", soft: "rgba(91, 141, 239, 0.12)", pill: "rgba(91, 141, 239, 0.2)" },
  { border: "#3DBD7D", dot: "#3DBD7D", soft: "rgba(61, 189, 125, 0.12)", pill: "rgba(61, 189, 125, 0.22)" },
  { border: "#C084FC", dot: "#A855F7", soft: "rgba(168, 85, 247, 0.1)", pill: "rgba(168, 85, 247, 0.18)" },
  { border: "#F97316", dot: "#EA580C", soft: "rgba(249, 115, 22, 0.1)", pill: "rgba(249, 115, 22, 0.18)" },
  { border: "#14B8A6", dot: "#0D9488", soft: "rgba(20, 184, 166, 0.11)", pill: "rgba(20, 184, 166, 0.2)" },
  { border: "#E11D48", dot: "#E11D48", soft: "rgba(225, 29, 72, 0.08)", pill: "rgba(225, 29, 72, 0.15)" },
  { border: "#E0C271", dot: "#C3A85E", soft: "rgba(224, 194, 113, 0.18)", pill: "rgba(224, 194, 113, 0.35)" },
] as const;

function accentForCategoriaId(categoriaId: string) {
  let h = 0;
  for (let i = 0; i < categoriaId.length; i += 1) {
    h = (h + categoriaId.charCodeAt(i) * (i + 3)) % 997;
  }
  return PROFESSION_ACCENTS[h % PROFESSION_ACCENTS.length];
}

// ─── Link para perfil público do prestador ───────────────────────────────────

function buildPrestadorHref(worker: Worker): string {
  const q = new URLSearchParams({
    categoria_id: worker.categoriaId,
    categoria: worker.role,
    nome: worker.name,
    score: String(worker.rating),
  });
  if (worker.tags.length) q.set("tags", worker.tags.join("|"));
  if (worker.fotoUrl) q.set("foto", worker.fotoUrl);
  return `/prestador/${encodeURIComponent(worker.prestadorUserId)}?${q.toString()}`;
}

function resolveApiAsset(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}${path}`;
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

// ─── Mapeia a resposta do backend (/explore) para o formato da tela ─────────────

function mapExploreToCategories(data: ExploreCategoria[]): Category[] {
  return data.map((cat) => ({
    label: cat.categoria,
    workers: cat.prestadores.map((p) => {
      const city = [p.cidade, p.estado].filter(Boolean).join(", ");
      const portfolioSorted = [...(p.portfolio ?? [])].sort(
        (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
      );
      return {
        id: `${cat.categoria_id}-${p.user_id}`,
        prestadorUserId: p.user_id,
        categoriaId: cat.categoria_id,
        name: p.nome,
        role: cat.categoria,
        city: city || "Localização não informada",
        rating: Number(p.score ?? 0),
        media: portfolioSorted.map((item) => ({
          type: item.tipo === "video" ? ("video" as const) : ("photo" as const),
          url: item.url,
        })),
        tags: p.tags ?? [],
        distance: "",
        distanceKm: 0,
        availability: "hoje" as Availability,
        fotoUrl: p.foto_url ?? null,
      } satisfies Worker;
    }),
  }));
}

// ─── WorkerCard ───────────────────────────────────────────────────────────────

function WorkerCard({ worker }: { worker: Worker }) {
  const ac = accentForCategoriaId(worker.categoriaId || worker.role);
  const availDot = availabilityColor[worker.availability];
  const fotoSrc = resolveApiAsset(worker.fotoUrl);
  const href = buildPrestadorHref(worker);
  const thumbs = worker.media.slice(0, 3);

  const accentVars = {
    ["--ac-border" as string]: ac.border,
    ["--ac-soft" as string]: ac.soft,
    ["--ac-pill" as string]: ac.pill,
    ["--ac-dot" as string]: ac.dot,
  } as React.CSSProperties;

  return (
    <Link href={href} prefetch={false} className="explore-card-link explore-worker-card" aria-label={`Ver perfil de ${worker.name}`}>
      <article className="explore-worker-card__inner" style={accentVars}>
        <div className="explore-worker-card__avatar">
          <div className="explore-worker-card__avatar-ring">
            {fotoSrc ? (
              <Image src={fotoSrc} alt="" width={76} height={76} sizes="(max-width: 767px) 56px, 76px" />
            ) : (
              <Image src="/images/profile_explore.svg" alt="" width={76} height={76} />
            )}
          </div>
        </div>

        <div className="explore-worker-card__body">
          <div className="explore-worker-card__row">
            <span className="explore-worker-card__dot" aria-hidden />
            <span className="explore-worker-card__role">{worker.role}</span>
          </div>
          <h3 className="explore-worker-card__name">{worker.name}</h3>
          <p className="explore-worker-card__meta">
            <Image src="/images/location.svg" alt="" width={14} height={17} style={{ flexShrink: 0, opacity: 0.85 }} />
            <span>{worker.city}</span>
          </p>
          <div className="explore-worker-card__rating-row">
            <span className="explore-worker-card__rating">{worker.rating.toFixed(1)}</span>
            <Image src="/images/review.svg" alt="" width={18} height={18} />
            <span className="explore-worker-card__avail" style={{ color: availDot }}>
              <span className="explore-worker-card__avail-dot" style={{ background: availDot }} />
              {availabilityLabel[worker.availability]}
            </span>
          </div>
          {worker.tags.length > 0 ? (
            <div className="explore-worker-card__tags">
              {worker.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="explore-worker-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="explore-worker-card__media">
          {thumbs.length === 0 ? (
            <div className="explore-worker-card__thumb explore-worker-card__thumb--empty">
              <Image src="/images/picture.svg" alt="" width={40} height={34} />
            </div>
          ) : (
            thumbs.map((m, i) => {
              const thumb = m.url ? resolveApiAsset(m.url) : null;
              return (
                <div key={`${m.url ?? i}-${i}`} className="explore-worker-card__thumb">
                  {thumb && m.type === "photo" ? (
                    <Image src={thumb} alt="" width={76} height={100} sizes="(max-width: 767px) 72px, 76px" />
                  ) : thumb && m.type === "video" ? (
                    <>
                      <video src={thumb} muted playsInline preload="metadata" />
                      <div className="explore-worker-card__thumb-play">
                        <Image src="/images/play.svg" alt="" width={28} height={28} />
                      </div>
                    </>
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Image src="/images/picture.svg" alt="" width={32} height={28} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </article>
    </Link>
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
    <button
      type="button"
      onClick={onToggle}
      className={`explore-filter-chip${selected ? " explore-filter-chip--selected" : ""}`}
    >
      {label}
    </button>
  );
}

// ─── FilterModal ──────────────────────────────────────────────────────────────

function FilterModal({
  open,
  filters,
  onChange,
  onClose,
  specialtyOptions,
}: {
  open: boolean;
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
  specialtyOptions: string[];
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

  const Divider = () => <div className="explore-sheet__divider" aria-hidden />;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }} />
      <div className="explore-sheet">

        <div style={{ width: "60px", height: "6px", background: "#DEDEDE", borderRadius: "3px", margin: "0 auto 24px" }} />

        <div className="explore-sheet__header">
          <p className="explore-sheet__title">Filtrar</p>
          <button type="button" className="explore-sheet__link-btn" onClick={handleClear}>
            Limpar tudo
          </button>
        </div>

        {/* Especialidade */}
        <div>
          <p className="explore-sheet__section-label">Especialidade</p>
          <div className="explore-sheet__chip-row">
            {specialtyOptions.map((s) => (
              <FilterChip key={s} label={s} selected={local.specialties.includes(s)} onToggle={() => toggleSpecialty(s)} />
            ))}
          </div>
          {specialtyOptions.length === 0 && (
            <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "18px", color: "#AAAAAA", margin: "10px 0 0" }}>
              Nenhuma especialidade listada ainda. Aguarde o carregamento dos prestadores ou limpe os filtros.
            </p>
          )}
        </div>

        <Divider />

        {/* Localização */}
        <div>
          <p className="explore-sheet__section-label">Localização</p>
          <LocationSlider value={local.maxKm} onChange={(maxKm) => setLocal((f) => ({ ...f, maxKm }))} />
        </div>

        <Divider />

        {/* Disponibilidade */}
        <div>
          <p className="explore-sheet__section-label">Disponibilidade</p>
          <div className="explore-sheet__chip-row">
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
          <p className="explore-sheet__section-label" style={{ marginBottom: "8px" }}>Reputação mínima</p>
          <RatingSlider value={local.minRating} onChange={(minRating) => setLocal((f) => ({ ...f, minRating }))} />
        </div>

        <button type="button" className="explore-sheet__primary" onClick={handleApply}>
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
      <div className="explore-sheet">
        <div style={{ width: "60px", height: "6px", background: "#DEDEDE", borderRadius: "3px", margin: "0 auto 24px" }} />
        <p className="explore-sheet__title" style={{ marginBottom: "20px" }}>Ordenar por</p>
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
        <button type="button" className="explore-sheet__primary" onClick={() => { onChange(local); onClose(); }}>
          Confirmar
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const router = useRouter();
  const homeHub = useHomeHub();
  /** Só bloqueia no modo Profissional do hub; quem também é prestador pode usar Explore na aba Contratante. */
  const exploreBloqueadoModoProfissional = homeHub?.activeTab === "profissional";

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [filters, setFilters] = useState<FilterState>({
    specialties: [],
    maxKm: null,
    availability: "",
    minRating: null,
  });

  const activeFilterCount = [
    filters.specialties.length > 0,
    filters.maxKm !== null,
    filters.availability !== "",
    filters.minRating !== null,
  ].filter(Boolean).length;

  const currentSortLabel = SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "Ordenar";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingExplore, setLoadingExplore] = useState(true);
  const [errorExplore, setErrorExplore] = useState("");
  /** `prestador` aqui = UI bloqueada no modo Profissional (não confundir com ter cadastro de prestador). */
  const [exploreAccess, setExploreAccess] = useState<"loading" | "prestador" | "cliente">("loading");

  useEffect(() => {
    if (exploreBloqueadoModoProfissional) {
      setExploreAccess("prestador");
      setCategories([]);
      setErrorExplore("");
      setLoadingExplore(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadingExplore(true);
      setExploreAccess("loading");
      setErrorExplore("");
      try {
        const data = await ClientGateway.getExplore();
        if (cancelled) return;
        setCategories(mapExploreToCategories(data));
        setExploreAccess("cliente");
      } catch (err: any) {
        if (!cancelled) {
          setErrorExplore(err?.message || "Não foi possível carregar os prestadores.");
        }
      } finally {
        if (!cancelled) setLoadingExplore(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [exploreBloqueadoModoProfissional]);

  const visibleCategories = useMemo(
    () => applyFiltersAndSort(categories, filters, sort),
    [categories, filters, sort],
  );

  const specialtiesFromData = useMemo(
    () =>
      Array.from(
        new Set(categories.flatMap((c) => c.workers.flatMap((w) => w.tags))),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [categories],
  );

  return (
    <div className="explore-page">

      {/* ── Topo: contexto + busca ── */}
      <div className="explore-page__shell explore-page__search-wrap">
        <header className="explore-page__hero">
          <h1 className="explore-page__title">Explorar serviços</h1>
          <p className="explore-page__subtitle">Navegue por categoria e encontre profissionais para o que você precisa.</p>
        </header>

        <div className="explore-page__search">
          <Image className="explore-page__search-icon" src="/images/Lupa.svg" alt="" width={44} height={44} />
          <input type="search" placeholder="Que serviço você precisa hoje?" aria-label="Buscar serviço" />
        </div>
        <button type="button" className="explore-page__back" onClick={() => router.push(ROUTES.hub)}>
          ← Voltar ao hub
        </button>
      </div>

      {/* ── Resultados ── */}
      <div className="results-scroll explore-page__shell explore-page__results explore-page__results--min">

        {exploreAccess === "cliente" ? (
          <div className="explore-page__toolbar">
            <button
              type="button"
              className={`explore-page__tool${sort !== "relevancia" ? " explore-page__tool--active" : ""}`}
              onClick={() => setSortOpen(true)}
            >
              <Image src="/images/ordenar.svg" alt="" width={26} height={26} />
              {currentSortLabel}
            </button>
            <button
              type="button"
              className={`explore-page__tool${activeFilterCount > 0 ? " explore-page__tool--active" : ""}`}
              onClick={() => setFilterOpen(true)}
            >
              <Image src="/images/filter.svg" alt="" width={26} height={26} />
              Filtrar{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          </div>
        ) : null}

        {exploreAccess === "loading" || loadingExplore ? (
          <div className="explore-state">
            <p className="explore-state__text">Carregando prestadores...</p>
          </div>
        ) : exploreAccess === "prestador" ? (
          <div
            className="explore-page__prestador-block"
            style={{
              maxWidth: 640,
              margin: "0 auto",
              padding: "clamp(28px, 5vw, 48px)",
              borderRadius: 24,
              border: "1px solid #E8E7E4",
              background: "linear-gradient(160deg, rgba(224, 194, 113, 0.14) 0%, #FFFFFF 45%, #FAFAF8 100%)",
              boxShadow: "0 8px 32px rgba(39,39,39,0.06)",
            }}
          >
            <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(24px, 4vw, 34px)", color: "#272727", margin: "0 0 16px" }}>
              Explore no modo profissional
            </p>
            <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "clamp(17px, 2.5vw, 22px)", color: "#535353", lineHeight: 1.55, margin: "0 0 28px" }}>
              O catálogo de profissionais fica disponível quando você usa o hub como <strong>Contratante</strong>. No modo <strong>Profissional</strong>, o foco é o seu trabalho (portfólio, serviços e contratos como prestador).
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 16px" }}>
              <button
                type="button"
                onClick={() => {
                  homeHub?.setActiveTab("contratante");
                  router.push(ROUTES.hub);
                }}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 24px", borderRadius: 999, background: "#E0C271", color: "#272727", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: 18, border: "none", cursor: "pointer" }}
              >
                Hub como contratante
              </button>
              <Link
                href={ROUTES.portifolio}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 24px", borderRadius: 999, background: "#FFFFFF", color: "#272727", border: "2px solid #DEDEDE", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: 18, textDecoration: "none" }}
              >
                Portfólio
              </Link>
              <Link
                href={ROUTES.services}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 24px", borderRadius: 999, background: "#FFFFFF", color: "#272727", border: "2px solid #DEDEDE", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: 18, textDecoration: "none" }}
              >
                Meus serviços
              </Link>
            </div>
          </div>
        ) : errorExplore ? (
          <div className="explore-state">
            <p className="explore-state__text explore-state__text--error">{errorExplore}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="explore-state">
            <p className="explore-state__text">Nenhum prestador encontrado.</p>
          </div>
        ) : visibleCategories.length === 0 ? (
          <div className="explore-state">
            <p className="explore-state__text">Nenhum profissional encontrado com os filtros aplicados.</p>
            <button
              type="button"
              className="explore-state__btn"
              onClick={() => setFilters({ specialties: [], maxKm: null, availability: "", minRating: null })}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          visibleCategories.map((category, catIdx) => (
            <section key={category.label} className="explore-category" aria-labelledby={`explore-cat-${catIdx}`}>
              <h2 className="explore-category__title" id={`explore-cat-${catIdx}`}>
                {category.label}
              </h2>
              <div className="explore-cards-row">
                {category.workers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <FilterModal
        open={filterOpen}
        filters={filters}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
        specialtyOptions={specialtiesFromData}
      />
      <SortModal open={sortOpen} sort={sort} onChange={setSort} onClose={() => setSortOpen(false)} />
    </div>
  );
}
