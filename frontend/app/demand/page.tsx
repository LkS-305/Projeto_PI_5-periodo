"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClientGateway, type Categoria } from "@/lib/gateways/ClientGateway";

// ─── Types ────────────────────────────────────────────────────────────────────

type AvailabilityKey = "hoje" | "amanha" | "semana" | "quinze" | "mes" | "indisponivel";
type ViewState = "form" | "searching" | "results";

interface MediaItem {
  type: "photo" | "video";
}

interface Worker {
  id: number;
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

// ─── Mock de profissionais ────────────────────────────────────────────────────


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

function WorkerCard({ worker, onSelect }: { worker: Worker; onSelect: (w: Worker) => void }) {
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
      onClick={() => onSelect(worker)}
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

      let counter = 0;
      const workers: Worker[] = catData.flatMap((cat) =>
        cat.prestadores.map((p) => {
          const city = [p.cidade, p.estado].filter(Boolean).join(", ");
          return {
            id: ++counter,
            prestadorId: p.user_id,
            categoriaId: cat.categoria_id,
            name: p.nome,
            role: cat.categoria,
            city: city || "Localização não informada",
            rating: Number(p.score ?? 0),
            media: (p.portfolio ?? []).map((it) => ({
              type: it.tipo === "video" ? "video" : "photo",
            })) as MediaItem[],
            tags: p.tags ?? [],
            distanceKm: 0,
            distance: "",
            availability: "hoje",
            profession: cat.categoria,
          } as Worker;
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
              {loadingCategorias ? (
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "26px", color: "#888", margin: 0 }}>
                  Carregando categorias...
                </p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ width: "10px", height: "40px", borderRadius: "5px", backgroundColor: "#E0C271", flexShrink: 0 }} />
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 600, fontSize: "36px", color: "#FAF9F5", margin: 0 }}>
                      Especialidade{" "}
                      <span style={{ fontWeight: 300, fontSize: "28px", color: "#888" }}>— opcional</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
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
                    onClick={() => router.push("/contracts")}
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
                  <Image src="/images/profile_explore.svg" alt={selectedWorker.name} width={60} height={60} style={{ flexShrink: 0 }} />
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
