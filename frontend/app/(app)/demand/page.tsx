"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClientGateway, type Categoria } from "@/lib/gateways/ClientGateway";
import { ROUTES } from "@/lib/routes";
import "../explore/explore.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailabilityKey = "hoje" | "amanha" | "semana" | "quinze" | "mes" | "indisponivel";
type ViewState = "form" | "searching" | "results";

interface MediaItem {
  type: "photo" | "video";
  url?: string;
}

interface Worker {
  id: string;
  prestadorId: string;
  categoriaId: string;
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
  fotoUrl?: string | null;
}

interface FormState {
  profession: string;
  specialties: string[];
  maxKm: number | null;
  availability: AvailabilityKey | "";
  minRating: number | null;
}

// ─── Especialidades por slug de categoria ────────────────────────────────────
// Mapeamento de slug → sub-especialidades para enriquecer a busca.
// Se uma categoria do banco não tiver mapeamento, a seção de especialidade
// simplesmente não aparece (sem quebrar o fluxo).

const SPECIALTIES_BY_SLUG: Record<string, string[]> = {
  limpeza:      ["Residencial", "Comercial", "Pós-obra", "Vidros", "Piscina", "Carpete"],
  eletrica:     ["Quadro Elétrico", "Tomadas", "Iluminação", "Projeto Elétrico", "Ar-condicionado"],
  encanador:    ["Tubulação", "Hidráulica", "Box", "Aquecedor", "Desentupimento"],
  aulas:        ["Matemática", "Português", "Inglês", "Física", "Química", "Programação"],
  beleza:       ["Corte", "Coloração", "Manicure", "Pedicure", "Maquiagem", "Sobrancelha"],
  "ti-suporte": ["Formatação", "Redes", "Suporte Remoto", "Desenvolvimento", "Infraestrutura"],
};

/** Cor de destaque por categoria — igual ao /explore */
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

function resolveApiAsset(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}${path}`;
}

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

/** Fundo do card de demanda — pastel suave (creme + névoa azulada), com texto escuro nos controles. */
const DEMAND_PANEL_BG =
  "linear-gradient(168deg, hsl(48, 42%, 97%) 0%, hsl(205, 38%, 94%) 100%)";

/** Trilha “vazia” dos sliders sobre fundo claro */
const SLIDER_TRACK_REST = "rgba(45, 52, 62, 0.12)";



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
        padding: "6px 14px",
        border: `1.5px solid ${selected ? "#C3A85E" : "rgba(45, 42, 38, 0.12)"}`,
        borderRadius: "50px",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        fontWeight: selected ? 600 : 400,
        fontSize: "15px",
        color: selected ? "#5c4d1f" : "#4a4742",
        backgroundColor: selected ? "rgba(224, 194, 113, 0.38)" : "rgba(255, 255, 255, 0.72)",
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
            "rgba(45, 42, 38, 0.12)";
          (e.currentTarget as HTMLDivElement).style.color = "#4a4742";
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
        backgroundColor: "rgba(195, 168, 94, 0.22)",
        margin: "18px 0",
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
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
        <span style={{
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 600,
          fontSize: "17px",
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
              fontSize: "13px",
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

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        {["1 km", "15 km", "30 km", "50 km+"].map((l) => (
          <span key={l} style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "12px", color: "#666" }}>{l}</span>
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
    <div style={{ paddingTop: "36px", padding: "36px 4px 0" }}>
      <div style={{ position: "relative" }}>
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              top: "-40px",
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
              fontSize: "14px",
              padding: "4px 10px",
              borderRadius: "12px",
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

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
        {["Qualquer", "★ 1,0", "★ 2,0", "★ 3,0", "★ 4,0", "★ 5,0"].map((l) => (
          <span key={l} style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "12px", color: "#666" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

// ─── WorkerCard (mesmo visual que /explore; aqui abre o modal de solicitar serviço) ─

function WorkerCard({ worker, onSelect }: { worker: Worker; onSelect: (w: Worker) => void }) {
  const ac = accentForCategoriaId(worker.categoriaId || worker.role);
  const availDot = availabilityColor[worker.availability];
  const fotoSrc = resolveApiAsset(worker.fotoUrl);
  const thumbs = worker.media.slice(0, 3);

  const accentVars = {
    ["--ac-border" as string]: ac.border,
    ["--ac-soft" as string]: ac.soft,
    ["--ac-pill" as string]: ac.pill,
    ["--ac-dot" as string]: ac.dot,
  } as React.CSSProperties;

  return (
    <button
      type="button"
      className="explore-card-link explore-worker-card"
      aria-label={`Solicitar serviço com ${worker.name}`}
      onClick={() => onSelect(worker)}
    >
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
    </button>
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
          background: DEMAND_PANEL_BG,
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
  const [profError, setProfError] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [serviceForm, setServiceForm] = useState({
    titulo: "",
    descricao: "",
    data_inicio: "",
    duracao: "",
    preco_acordado: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const [form, setForm] = useState<FormState>({
    profession: "",
    specialties: [],
    maxKm: null,
    availability: "",
    minRating: null,
  });

  // Carrega categorias do banco
  useEffect(() => {
    ClientGateway.getCategorias()
      .then(setCategorias)
      .catch(() => setCategorias([]))
      .finally(() => setLoadingCategorias(false));
  }, []);

  // Categoria selecionada e suas especialidades
  const selectedCategoria = categorias.find((c) => c.id === form.profession);
  const selectedSpecialties = selectedCategoria
    ? (SPECIALTIES_BY_SLUG[selectedCategoria.slug] ?? [])
    : [];

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

  const handleSearch = async () => {
    if (!form.profession) {
      setProfError(true);
      setTimeout(() => setProfError(false), 600);
      return;
    }
    setView("searching");

    try {
      const data = await ClientGateway.getExplore();
      const catNome = categorias.find((c) => c.id === form.profession)?.nome ?? "";

      // Filtra o explore pela categoria selecionada (por id ou nome)
      const catData = data.filter(
        (cat) => cat.categoria_id === form.profession || cat.categoria === catNome,
      );

      const workers: Worker[] = catData.flatMap((cat) =>
        cat.prestadores.map((p) => {
          const city = [p.cidade, p.estado].filter(Boolean).join(", ");
          const portfolioSorted = [...(p.portfolio ?? [])].sort(
            (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
          );
          return {
            id: `${cat.categoria_id}-${p.user_id}`,
            prestadorId: p.user_id,
            categoriaId: cat.categoria_id,
            name: p.nome,
            role: cat.categoria,
            city: city || "Localização não informada",
            rating: Number(p.score ?? 0),
            media: portfolioSorted.map((it) => ({
              type: it.tipo === "video" ? ("video" as const) : ("photo" as const),
              url: it.url,
            })),
            tags: p.tags ?? [],
            distanceKm: 0,
            distance: "",
            availability: "hoje",
            profession: cat.categoria,
            fotoUrl: p.foto_url ?? null,
          } satisfies Worker;
        }),
      );

      // Filtra por especialidades selecionadas e nota mínima
      const filtered = workers.filter((w) => {
        if (
          form.specialties.length > 0 &&
          !form.specialties.some((s) => w.tags.includes(s))
        )
          return false;
        if (form.minRating !== null && w.rating < form.minRating) return false;
        return true;
      });

      setResults(filtered);
    } catch {
      setResults([]);
    } finally {
      setView("results");
    }
  };

  const openWorker = (worker: Worker) => {
    setSelectedWorker(worker);
    setServiceForm({ titulo: "", descricao: "", data_inicio: "", duracao: "", preco_acordado: "" });
    setCreateError("");
    setCreateSuccess(false);
  };

  const closeWorkerModal = () => {
    setSelectedWorker(null);
    setCreateError("");
    setCreateSuccess(false);
  };

  const handleCreateServico = async () => {
    if (!selectedWorker) return;
    if (!serviceForm.titulo.trim()) { setCreateError("Informe o título do serviço."); return; }
    if (!serviceForm.data_inicio) { setCreateError("Informe a data de início."); return; }
    if (!serviceForm.duracao) { setCreateError("Informe a duração estimada."); return; }

    const userId = typeof window !== "undefined" ? (() => {
      try { return JSON.parse(localStorage.getItem("authUser") ?? "null")?.id ?? null; } catch { return null; }
    })() : null;

    if (!userId) { setCreateError("Sessão expirada. Faça login novamente."); return; }

    setCreating(true);
    setCreateError("");
    try {
      await ClientGateway.createServico({
        user_id: userId,
        prestador_id: selectedWorker.prestadorId,
        categoria_id: selectedWorker.categoriaId,
        categoria: selectedWorker.role,
        titulo: serviceForm.titulo.trim(),
        descricao: serviceForm.descricao.trim(),
        preco_acordado: serviceForm.preco_acordado ? parseFloat(serviceForm.preco_acordado) : 0,
        data_inicio: new Date(serviceForm.data_inicio).toISOString(),
        duracao: serviceForm.duracao,
      });
      setCreateSuccess(true);
    } catch (err: any) {
      setCreateError(err?.message || "Erro ao criar serviço. Tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  const profLabel = categorias.find((c) => c.id === form.profession)?.nome ?? "";

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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FAF9F5;
          border: 2px solid #E0C271;
          cursor: grab;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          transition: transform 0.1s ease;
        }
        .demand-slider:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.18);
        }
        .demand-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FAF9F5;
          border: 2px solid #E0C271;
          cursor: grab;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        }

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

        /* Modal de criação de serviço */
        .service-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(39,39,39,0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .service-modal {
          background: rgba(30,30,30,0.96);
          border: 3px solid #C3A85E;
          border-radius: 36px;
          width: min(700px, 94vw);
          max-height: 90vh;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none;
          padding: clamp(28px, 3vw, 48px);
          box-sizing: border-box;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: fadeSlideIn 0.25s ease forwards;
        }
        .service-modal::-webkit-scrollbar { display: none; }
        .sm-label {
          display: block;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.8125rem, 1.1vw, 1.0625rem);
          font-weight: 600;
          color: #C8C7C5;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .sm-input, .sm-textarea, .sm-select {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(195,168,94,0.4);
          border-radius: 14px;
          padding: 14px 18px;
          font-family: 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(0.875rem, 1.1vw, 1.125rem);
          color: #FAF9F5;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .sm-input:focus, .sm-textarea:focus, .sm-select:focus {
          border-color: #E0C271;
        }
        .sm-input::placeholder, .sm-textarea::placeholder { color: #666; }
        .sm-textarea { resize: vertical; min-height: 90px; }
        .sm-select option { background: #1e1e1e; color: #FAF9F5; }
        .sm-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 480px) { .sm-row { grid-template-columns: 1fr; } }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ESTADO: FORMULÁRIO                                                    */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {view === "form" && (
        <div
          style={{
            paddingTop: "36px",
            paddingBottom: "48px",
            paddingLeft: "clamp(24px, 5vw, 72px)",
            paddingRight: "clamp(24px, 5vw, 72px)",
          }}
        >
          {/* ── Título ── */}
          <div style={{ marginBottom: "24px" }}>
            <div
              onClick={() => router.push(ROUTES.hub)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "18px",
                fontWeight: 500,
                color: "#535353",
                cursor: "pointer",
                marginBottom: "14px",
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
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                color: "#E0C271",
                lineHeight: 1,
                margin: 0,
                marginBottom: "8px",
                letterSpacing: "-1px",
              }}
            >
              Demanda Inteligente
            </h1>
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: "clamp(0.95rem, 1.4vw, 1.25rem)",
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
              borderRadius: "28px",
              background: DEMAND_PANEL_BG,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "3px solid #C3A85E",
              boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
              padding: "28px 36px",
              boxSizing: "border-box",
            }}
          >

            {/* ── SEÇÃO 1: Profissional ── */}
            <div className={profError ? "shake" : ""}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "26px",
                    borderRadius: "4px",
                    backgroundColor: profError ? "#D92B2E" : "#E0C271",
                    flexShrink: 0,
                    transition: "background-color 0.3s",
                  }}
                />
                <p
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "22px",
                    color: profError ? "#D92B2E" : "#2f2d2a",
                    margin: 0,
                    transition: "color 0.3s",
                  }}
                >
                  Profissional{" "}
                  <span style={{ fontWeight: 300, fontSize: "15px", color: profError ? "#D92B2E" : "#888" }}>
                    {profError ? "— selecione uma categoria" : "— obrigatório"}
                  </span>
                </p>
              </div>
              {loadingCategorias ? (
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "15px", color: "#888", margin: 0 }}>
                  Carregando categorias...
                </p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {categorias.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.nome}
                      selected={form.profession === cat.id}
                      onToggle={() => setProfession(cat.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── SEÇÃO 2: Especialidade ── */}
            {selectedCategoria && selectedSpecialties.length > 0 && (
              <>
                <SectionDivider />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ width: "6px", height: "26px", borderRadius: "4px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "22px", color: "#2f2d2a", margin: 0 }}>
                      Especialidade{" "}
                      <span style={{ fontWeight: 300, fontSize: "15px", color: "#888" }}>— opcional</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {selectedSpecialties.map((s) => (
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "6px", height: "26px", borderRadius: "4px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "22px", color: "#2f2d2a", margin: 0 }}>
                  Localização{" "}
                  <span style={{ fontWeight: 300, fontSize: "15px", color: "#888" }}>— opcional</span>
                </p>
              </div>
              <LocationSlider value={form.maxKm} onChange={setMaxKm} />
            </div>

            <SectionDivider />

            {/* ── SEÇÃO 4: Disponibilidade ── */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "6px", height: "26px", borderRadius: "4px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "22px", color: "#2f2d2a", margin: 0 }}>
                  Disponibilidade{" "}
                  <span style={{ fontWeight: 300, fontSize: "15px", color: "#888" }}>— opcional</span>
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <div style={{ width: "6px", height: "26px", borderRadius: "4px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "22px", color: "#2f2d2a", margin: 0 }}>
                  Reputação mínima{" "}
                  <span style={{ fontWeight: 300, fontSize: "15px", color: "#888" }}>— opcional</span>
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
                  gap: "10px",
                  minWidth: "min(100%, 320px)",
                  width: "auto",
                  height: "48px",
                  paddingLeft: "24px",
                  paddingRight: "22px",
                  borderRadius: "999px",
                  backgroundColor: "#E0C271",
                  border: "none",
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "17px",
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#272727" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              className="explore-card-tokens demand-results-grid"
            >
              {results.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} onSelect={openWorker} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL: CRIAR SERVIÇO ─────────────────────────────────────────────── */}
      {selectedWorker && (
        <div
          className="service-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeWorkerModal(); }}
        >
          <div className="service-modal">

            {createSuccess ? (
              /* ── Tela de sucesso ── */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "20px 0", textAlign: "center" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(61,189,125,0.15)", border: "3px solid #3DBD7D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3DBD7D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "clamp(1.25rem, 2vw, 1.75rem)", color: "#E0C271", margin: 0 }}>
                  Serviço criado com sucesso!
                </p>
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)", color: "#C8C7C5", margin: 0, lineHeight: 1.6 }}>
                  Seu serviço com <strong style={{ color: "#FAF9F5" }}>{selectedWorker.name}</strong> foi solicitado.<br />
                  Acompanhe pelo painel de contratos.
                </p>
                <div style={{ display: "flex", gap: "14px", marginTop: "8px" }}>
                  <button
                    onClick={closeWorkerModal}
                    style={{ padding: "12px 28px", borderRadius: "50px", border: "2px solid rgba(195,168,94,0.4)", background: "transparent", color: "#C8C7C5", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "1rem", fontWeight: 500, cursor: "pointer" }}
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => router.push(ROUTES.contracts)}
                    style={{ padding: "12px 28px", borderRadius: "50px", border: "none", background: "#E0C271", color: "#272727", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Ver contratos →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ── Cabeçalho: info do prestador ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1.5px solid rgba(195,168,94,0.25)" }}>
                  {resolveApiAsset(selectedWorker.fotoUrl) ? (
                    <Image
                      src={resolveApiAsset(selectedWorker.fotoUrl)!}
                      alt={selectedWorker.name}
                      width={60}
                      height={60}
                      style={{ flexShrink: 0, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <Image src="/images/profile_explore.svg" alt={selectedWorker.name} width={60} height={60} style={{ flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(1rem, 1.6vw, 1.375rem)", color: "#FAF9F5", margin: "0 0 4px", lineHeight: 1 }}>
                      {selectedWorker.name}
                    </p>
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "clamp(0.8125rem, 1vw, 1rem)", color: "#C3A85E", margin: 0 }}>
                      {selectedWorker.role} · {selectedWorker.city}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "clamp(1rem, 1.4vw, 1.25rem)", color: "#FAF9F5" }}>
                      {selectedWorker.rating.toFixed(1)}
                    </span>
                    <Image src="/images/review.svg" alt="★" width={18} height={18} />
                  </div>
                </div>

                <p style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)", color: "#E0C271", margin: "0 0 24px", letterSpacing: "-0.5px" }}>
                  Solicitar serviço
                </p>

                {/* ── Formulário ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                  <div>
                    <label className="sm-label">Título do serviço *</label>
                    <input
                      className="sm-input"
                      type="text"
                      placeholder="Ex: Instalação de tomadas na sala"
                      value={serviceForm.titulo}
                      onChange={(e) => setServiceForm((f) => ({ ...f, titulo: e.target.value }))}
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="sm-label">Descrição</label>
                    <textarea
                      className="sm-textarea"
                      placeholder="Descreva o que precisa ser feito..."
                      value={serviceForm.descricao}
                      onChange={(e) => setServiceForm((f) => ({ ...f, descricao: e.target.value }))}
                      maxLength={500}
                    />
                  </div>

                  <div className="sm-row">
                    <div>
                      <label className="sm-label">Data de início *</label>
                      <input
                        className="sm-input"
                        type="datetime-local"
                        value={serviceForm.data_inicio}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setServiceForm((f) => ({ ...f, data_inicio: e.target.value }))}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                    <div>
                      <label className="sm-label">Duração estimada *</label>
                      <select
                        className="sm-select"
                        value={serviceForm.duracao}
                        onChange={(e) => setServiceForm((f) => ({ ...f, duracao: e.target.value }))}
                      >
                        <option value="">Selecionar...</option>
                        <option value="30 min">30 min</option>
                        <option value="1h">1 hora</option>
                        <option value="2h">2 horas</option>
                        <option value="3h">3 horas</option>
                        <option value="4h">4 horas</option>
                        <option value="6h">6 horas</option>
                        <option value="8h">8 horas</option>
                        <option value="1 dia">1 dia inteiro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="sm-label">Valor combinado (R$) <span style={{ fontWeight: 400, textTransform: "none", color: "#555" }}>— opcional</span></label>
                    <input
                      className="sm-input"
                      type="number"
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                      value={serviceForm.preco_acordado}
                      onChange={(e) => setServiceForm((f) => ({ ...f, preco_acordado: e.target.value }))}
                    />
                  </div>

                  {createError && (
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "0.9375rem", color: "#D92B2E", margin: 0, padding: "10px 16px", background: "rgba(217,43,46,0.1)", borderRadius: "10px" }}>
                      {createError}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "14px", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button
                      onClick={closeWorkerModal}
                      style={{ padding: "14px 28px", borderRadius: "50px", border: "2px solid rgba(195,168,94,0.35)", background: "transparent", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "clamp(0.875rem, 1.1vw, 1.0625rem)", fontWeight: 500, color: "#C8C7C5", cursor: "pointer", transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C3A85E")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(195,168,94,0.35)")}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateServico}
                      disabled={creating}
                      style={{ padding: "14px 32px", borderRadius: "50px", border: "none", background: creating ? "#9c834a" : "#E0C271", fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "clamp(0.875rem, 1.1vw, 1.0625rem)", fontWeight: 600, color: "#272727", cursor: creating ? "default" : "pointer", transition: "transform 0.2s, opacity 0.2s", opacity: creating ? 0.7 : 1 }}
                      onMouseEnter={(e) => { if (!creating) e.currentTarget.style.transform = "scale(1.03)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {creating ? "Solicitando..." : "Confirmar solicitação"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
