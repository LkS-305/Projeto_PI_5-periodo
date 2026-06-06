"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import type { Servico, ServicoStatus } from "@/types/entities/servico";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContractStatus =
  | "em_andamento"
  | "aguardando"
  | "pagamento_pendente"
  | "concluido"
  | "cancelado";

type Tab = "vigentes" | "passados";

interface Contract {
  id: string;
  provider: { name: string; role: string; city: string };
  category: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  durationDays: number;
  address: string;
  value: number;
  progressPct?: number;
  rating?: number;
  cancelReason?: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

const statusLabel: Record<ContractStatus, string> = {
  em_andamento:      "Em andamento",
  aguardando:        "Aguardando início",
  pagamento_pendente:"Pagamento pendente",
  concluido:         "Concluído",
  cancelado:         "Cancelado",
};

const statusIcon: Record<ContractStatus, string> = {
  em_andamento:      "↻",
  aguardando:        "◷",
  pagamento_pendente:"⚠",
  concluido:         "✓",
  cancelado:         "✕",
};

const statusColor: Record<ContractStatus, string> = {
  em_andamento:      "#3DBD7D",
  aguardando:        "#F5A623",
  pagamento_pendente:"#D92B2E",
  concluido:         "#8E8D8C",
  cancelado:         "#D92B2E",
};

const statusBg: Record<ContractStatus, string> = {
  em_andamento:      "rgba(61,189,125,0.10)",
  aguardando:        "rgba(245,166,35,0.10)",
  pagamento_pendente:"rgba(217,43,46,0.10)",
  concluido:         "rgba(142,141,140,0.10)",
  cancelado:         "rgba(217,43,46,0.10)",
};

// ─── Mock data ────────────────────────────────────────────────────────────────


// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatValue(n: number): string {
  if (n === 0) return "—";
  return "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

// ─── RatingStars ──────────────────────────────────────────────────────────────

function RatingStars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              fontSize: "30px",
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
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "28px",
          color: "#272727",
        }}
      >
        {rating.toFixed(1).replace(".", ",")}
      </span>
      <span
        style={{
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "22px",
          color: "#8E8D8C",
        }}
      >
        avaliado
      </span>
    </div>
  );
}

// ─── RatingPicker ─────────────────────────────────────────────────────────────

function RatingPicker({
  onConfirm,
  onCancel,
}: {
  onConfirm: (r: number) => void;
  onCancel: () => void;
}) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(i)}
            style={{
              fontSize: "44px",
              lineHeight: 1,
              cursor: "pointer",
              color: i <= (hovered || selected) ? "#E0C271" : "#DEDEDE",
              transition: "color 0.12s, transform 0.12s",
              transform: i <= (hovered || selected) ? "scale(1.12)" : "scale(1)",
              display: "inline-block",
            }}
          >
            ★
          </span>
        ))}
        {selected > 0 && (
          <span
            style={{
              marginLeft: "14px",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "28px",
              color: "#272727",
            }}
          >
            {selected},0
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <button
          onClick={() => selected > 0 && onConfirm(selected)}
          disabled={selected === 0}
          style={{
            padding: "12px 30px",
            borderRadius: "30px",
            backgroundColor: selected > 0 ? "#E0C271" : "#EAEAEA",
            border: "none",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "24px",
            color: selected > 0 ? "#272727" : "#AAAAAA",
            cursor: selected > 0 ? "pointer" : "not-allowed",
            transition: "all 0.15s",
          }}
        >
          Confirmar avaliação
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "12px 24px",
            borderRadius: "30px",
            backgroundColor: "transparent",
            border: "2px solid #DEDEDE",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "24px",
            color: "#535353",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── ContractCard ─────────────────────────────────────────────────────────────

function ContractCard({
  contract,
  isVigente,
  displayRating,
  showPicker,
  onOpenPicker,
  onClosePicker,
  onRate,
}: {
  contract: Contract;
  isVigente: boolean;
  displayRating: number | undefined;
  showPicker: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onRate: (r: number) => void;
}) {
  const { status } = contract;
  const color  = statusColor[status];
  const bg     = statusBg[status];
  const label  = statusLabel[status];
  const icon   = statusIcon[status];
  const isRated = displayRating !== undefined;

  const cardBorder  = isVigente
    ? status === "pagamento_pendente" ? "4px solid #D92B2E" : "4px solid #E0C271"
    : "2px solid #EAEAEA";

  const SF: React.CSSProperties = {
    fontFamily: "'SF Pro Text', system-ui, sans-serif",
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "36px",
        border: cardBorder,
        backgroundColor: "#FAF9F5",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "box-shadow 0.18s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* ── Top row: category + status + value ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px 40px 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          {/* Category chip */}
          <span
            style={{
              ...SF,
              padding: "7px 22px",
              backgroundColor: isVigente ? "rgba(224,194,113,0.15)" : "#F4F4F4",
              border: `1.5px solid ${isVigente ? "#E0C271" : "#DEDEDE"}`,
              borderRadius: "30px",
              fontWeight: 500,
              fontSize: "24px",
              color: isVigente ? "#C3A85E" : "#535353",
            }}
          >
            {contract.category}
          </span>

          {/* Status badge */}
          <span
            style={{
              ...SF,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 18px",
              backgroundColor: bg,
              border: `1.5px solid ${color}`,
              borderRadius: "30px",
              fontWeight: 500,
              fontSize: "22px",
              color,
            }}
          >
            <span style={{ fontSize: "18px" }}>{icon}</span>
            {label}
          </span>
        </div>

        {/* Value */}
        <span
          style={{
            ...SF,
            fontWeight: 700,
            fontSize: "34px",
            color: status === "cancelado" ? "#AAAAAA" : "#272727",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {formatValue(contract.value)}
        </span>
      </div>

      {/* ── Provider row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "0 40px 22px",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#EAEAEA",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "2px solid #F0F0F0",
          }}
        >
          <Image
            src="/images/profile_explore.svg"
            alt={contract.provider.name}
            width={64}
            height={64}
            style={{ display: "block" }}
          />
        </div>
        <div>
          <p style={{ ...SF, fontWeight: 600, fontSize: "30px", color: "#272727", margin: 0, lineHeight: 1.2 }}>
            {contract.provider.name}
          </p>
          <p style={{ ...SF, fontWeight: 400, fontSize: "24px", color: "#8E8D8C", margin: 0, marginTop: "4px", lineHeight: 1 }}>
            {contract.provider.role} • {contract.provider.city}
          </p>
        </div>
      </div>

      {/* ── Progress bar (em_andamento only) ── */}
      {status === "em_andamento" && contract.progressPct !== undefined && (
        <div style={{ padding: "0 40px 22px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ ...SF, fontSize: "22px", color: "#8E8D8C" }}>
              Progresso do serviço
            </span>
            <span style={{ ...SF, fontSize: "22px", fontWeight: 600, color: "#3DBD7D" }}>
              {contract.progressPct}%
            </span>
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#EAEAEA",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${contract.progressPct}%`,
                backgroundColor: "#3DBD7D",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Info: dates + address ── */}
      <div style={{ padding: "0 40px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Dates */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8D8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span style={{ ...SF, fontSize: "26px", color: "#535353" }}>
            {contract.startDate}
            {contract.startDate !== contract.endDate && ` → ${contract.endDate}`}
            <span style={{ color: "#AAAAAA", marginLeft: "10px" }}>
              ({contract.durationDays} {contract.durationDays === 1 ? "dia" : "dias"})
            </span>
          </span>
        </div>
        {/* Address */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Image src="/images/location.svg" alt="local" width={16} height={20} style={{ flexShrink: 0 }} />
          <span style={{ ...SF, fontSize: "26px", color: "#535353" }}>
            {contract.address}
          </span>
        </div>
      </div>

      {/* ── Rating / cancel reason (passados) ── */}
      {!isVigente && (
        <div style={{ padding: "0 40px 24px" }}>
          {status === "cancelado" ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                backgroundColor: "rgba(217,43,46,0.06)",
                borderRadius: "14px",
              }}
            >
              <span style={{ ...SF, fontSize: "24px", color: "#D92B2E" }}>
                {contract.cancelReason}
              </span>
            </div>
          ) : isRated ? (
            <RatingStars rating={displayRating!} />
          ) : showPicker ? (
            <RatingPicker onConfirm={onRate} onCancel={onClosePicker} />
          ) : (
            <button
              onClick={onOpenPicker}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 28px",
                borderRadius: "30px",
                border: "2px solid #E0C271",
                backgroundColor: "transparent",
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: "24px",
                color: "#C3A85E",
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(224,194,113,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <span style={{ fontSize: "22px" }}>★</span> Avaliar serviço
            </button>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ height: "1.5px", backgroundColor: "#EAEAEA", margin: "0 40px" }} />

      {/* ── Footer: actions ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 40px 28px",
        }}
      >
        {isVigente ? (
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 30px",
              borderRadius: "30px",
              border: "2px solid #DEDEDE",
              backgroundColor: "transparent",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              color: "#535353",
              cursor: "pointer",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#272727"; e.currentTarget.style.color = "#272727"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#DEDEDE"; e.currentTarget.style.color = "#535353"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contato
          </button>
        ) : (
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 30px",
              borderRadius: "30px",
              border: `2px solid ${status === "cancelado" ? "#DEDEDE" : "#E0C271"}`,
              backgroundColor: "transparent",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              color: status === "cancelado" ? "#535353" : "#C3A85E",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = status === "cancelado" ? "#F4F4F4" : "rgba(224,194,113,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            Contratar novamente
          </button>
        )}

        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 20px",
            background: "transparent",
            border: "none",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "24px",
            color: "#272727",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Ver detalhes
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<ServicoStatus, ContractStatus> = {
  emAndamento: "em_andamento",
  aceito: "em_andamento",
  pendente: "aguardando",
  finalizado: "concluido",
  cancelado: "cancelado",
  recusado: "cancelado",
};

function formatDate(value: Date | string | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function mapServicoToContract(s: Servico): Contract {
  return {
    id: s.id,
    provider: {
      name: s.titulo || "Prestador",
      role: s.categoria || "",
      city: "",
    },
    category: s.categoria || "",
    status: STATUS_MAP[s.status] ?? "aguardando",
    startDate: formatDate(s.data_inicio),
    endDate: "",
    durationDays: 0,
    address: "",
    value: Number(s.preco_acordado ?? 0),
    rating: s.nota,
  };
}

export default function ContractsPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("vigentes");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  const [vigentes, setVigentes] = useState<Contract[]>([]);
  const [passados, setPassados] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoadingContracts(false);
      return;
    }
    (async () => {
      try {
        // serviços onde o usuário é contratante e onde é prestador
        const [comoUser, comoPrestador] = await Promise.all([
          ClientGateway.getServicosPorUser(userId).catch(() => []),
          ClientGateway.getServicosPorPrestador(userId).catch(() => []),
        ]);

        // deduplica por id
        const porId = new Map<string, Servico>();
        [...comoUser, ...comoPrestador].forEach((s) => porId.set(s.id, s));
        const contratos = Array.from(porId.values()).map(mapServicoToContract);

        const passadosStatus: ContractStatus[] = ["concluido", "cancelado"];
        setVigentes(contratos.filter((c) => !passadosStatus.includes(c.status)));
        setPassados(contratos.filter((c) => passadosStatus.includes(c.status)));
      } catch {
        /* mantém listas vazias */
      } finally {
        setLoadingContracts(false);
      }
    })();
  }, []);

  const displayed = activeTab === "vigentes" ? vigentes : passados;

  const menuItems = [
    { icon: "message.svg",  iconW: 42, iconH: 40, label: "Mensagens",    href: "/messages" },
    { icon: "settings.svg", iconW: 40, iconH: 40, label: "Configurações", href: "/settings" },
    { icon: "mode.svg",     iconW: 40, iconH: 40, label: "Modo escuro",  hasSwitch: true, href: null },
    { icon: "help.svg",     iconW: 40, iconH: 40, label: "Ajuda",        href: null },
    { icon: "logout.svg",   iconW: 40, iconH: 40, label: "Sair da conta", href: null },
  ];

  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#FAF9F5",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
      className="contracts-root"
    >
      <style>{`
        /* Scrollbar */
        .contracts-root::-webkit-scrollbar { width: 6px; }
        .contracts-root::-webkit-scrollbar-track { background: rgba(39,39,39,0.08); border-radius: 3px; margin: 16px 0; }
        .contracts-root::-webkit-scrollbar-thumb { background: rgba(195,168,94,0.45); border-radius: 3px; }
        .contracts-root::-webkit-scrollbar-thumb:hover { background: rgba(195,168,94,0.75); }
        .contracts-root { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.08); }

        /* Menu panel */
        .contracts-menu-panel {
          position: fixed; top: 90px; right: 0; width: 520px; height: calc(100vh - 90px);
          border-radius: 40px 0 0 40px; background-color: rgba(39,39,39,0.92);
          backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.28); z-index: 99;
          transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.645,0.045,0.355,1); overflow: hidden;
        }
        .contracts-menu-panel.open { transform: translateX(0); }

        /* Tab underline */
        .tab-btn { position: relative; background: none; border: none; cursor: pointer; padding: 0 0 14px; transition: color 0.2s; }
        .tab-btn::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 2px; background: #E0C271; transform: scaleX(0); transition: transform 0.25s cubic-bezier(0.645,0.045,0.355,1); }
        .tab-btn.active::after { transform: scaleX(1); }

        /* Cards fade */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .cards-list { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      {/* ── CABEÇALHO ─────────────────────────────────────────────────────────── */}
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
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", lineHeight: 1, marginLeft: "130px", letterSpacing: "-1px", userSelect: "none" }}>
          DOMI
        </span>
        <div style={{ flex: 1 }} />
        <Image src="/images/profile_notify.svg" alt="Perfil" width={52} height={53} onClick={() => router.push("/profile")} style={{ display: "block", cursor: "pointer" }} />
        <Image src="/images/navy.svg" alt="Menu" width={60} height={50} onClick={() => setMenuOpen((v) => !v)} style={{ display: "block", marginLeft: "60px", marginRight: "80px", cursor: "pointer" }} />
      </header>

      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />}

      {/* ── GLASS MENU PANEL ──────────────────────────────────────────────────── */}
      <div className={`contracts-menu-panel${menuOpen ? " open" : ""}`}>
        <p style={{ ...SF, fontWeight: 600, fontSize: "50px", color: "#FAF9F5", margin: 0, marginTop: "60px", marginLeft: "40px", lineHeight: 1.1 }}>Olá, Usuário!</p>
        {(() => {
          const firstLineTop = 145, rowHeight = 90;
          return (
            <>
              {[0,1,2,3,4,5].map((i) => (
                <div key={i} style={{ position: "absolute", left: 0, width: "520px", height: "2px", backgroundColor: "rgba(255,255,255,0.15)", top: `${firstLineTop + i * rowHeight}px` }} />
              ))}
              {menuItems.map((item, i) => {
                const centerY = firstLineTop + i * rowHeight + rowHeight / 2;
                return (
                  <div key={item.label} onClick={() => { if (item.href) router.push(item.href); }} style={{ position: "absolute", top: `${centerY}px`, transform: "translateY(-50%)", left: "40px", display: "flex", alignItems: "center", gap: "15px", cursor: "hasSwitch" in item && item.hasSwitch ? "default" : "pointer" }}>
                    <Image src={`/images/${item.icon}`} alt={item.label} width={item.iconW} height={item.iconH} style={{ flexShrink: 0 }} />
                    <span style={{ ...SF, fontWeight: 500, fontSize: "40px", color: "#FAF9F5", userSelect: "none" }} onMouseEnter={(e) => { if (!("hasSwitch" in item && item.hasSwitch)) e.currentTarget.style.textDecoration = "underline"; }} onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}>{item.label}</span>
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
          onClick={() => router.push("/home")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "28px", fontWeight: 500, color: "#535353", cursor: "pointer", marginBottom: "22px", userSelect: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
        >
          ← Voltar
        </div>

        {/* Título */}
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 600, fontSize: "90px", color: "#E0C271", lineHeight: 1, margin: 0, letterSpacing: "-2px", marginBottom: "12px" }}>
          Meus Contratos
        </h1>
        <p style={{ ...SF, fontWeight: 500, fontSize: "30px", color: "#535353", margin: 0, marginBottom: "48px" }}>
          {vigentes.length} {vigentes.length === 1 ? "contrato vigente" : "contratos vigentes"} · {passados.length} passados
        </p>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: "0px", marginBottom: "48px", borderBottom: "2px solid #EAEAEA" }}>
          {(["vigentes", "passados"] as Tab[]).map((tab) => {
            const count = tab === "vigentes" ? vigentes.length : passados.length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-btn${isActive ? " active" : ""}`}
                style={{
                  ...SF,
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "34px",
                  color: isActive ? "#272727" : "#8E8D8C",
                  marginRight: "48px",
                  paddingBottom: "14px",
                }}
              >
                {tab === "vigentes" ? "Vigentes" : "Passados"}
                <span
                  style={{
                    marginLeft: "10px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: isActive ? "#272727" : "#EAEAEA",
                    color: isActive ? "#FAF9F5" : "#8E8D8C",
                    fontSize: "22px",
                    fontWeight: 600,
                    verticalAlign: "middle",
                    lineHeight: 1,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── LISTA DE CARDS ── */}
        <div key={activeTab} className="cards-list" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {loadingContracts ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <p style={{ ...SF, fontSize: "32px", color: "#8E8D8C", margin: 0 }}>Carregando contratos...</p>
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "18px" }}>
              <p style={{ ...SF, fontSize: "32px", color: "#8E8D8C", margin: 0 }}>
                {activeTab === "vigentes" ? "Você não tem contratos ativos no momento." : "Nenhum contrato passado ainda."}
              </p>
              <button
                onClick={() => router.push("/explore")}
                style={{ padding: "16px 40px", borderRadius: "50px", backgroundColor: "#E0C271", border: "none", ...SF, fontWeight: 600, fontSize: "28px", color: "#272727", cursor: "pointer" }}
              >
                Explorar profissionais
              </button>
            </div>
          ) : (
            displayed.map((contract) => {
              const displayRating =
                ratings[contract.id] !== undefined
                  ? ratings[contract.id]
                  : contract.rating;
              return (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  isVigente={activeTab === "vigentes"}
                  displayRating={displayRating}
                  showPicker={pickerOpen === contract.id}
                  onOpenPicker={() => setPickerOpen(contract.id)}
                  onClosePicker={() => setPickerOpen(null)}
                  onRate={(r) => {
                    setRatings((prev) => ({ ...prev, [contract.id]: r }));
                    setPickerOpen(null);
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
