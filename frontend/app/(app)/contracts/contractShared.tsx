"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ClientGateway } from "@/lib/gateways/ClientGateway";
import { AvaliacaoGateway } from "@/lib/gateways/AvaliacaoGateway";
import type { Servico, ServicoStatus } from "@/types/entities/servico";
// ─── Types ────────────────────────────────────────────────────────────────────

export type ContractStatus =
  | "em_andamento"
  | "aguardando"
  | "pagamento_pendente"
  | "concluido"
  | "cancelado";

export interface Contract {
  id: string;
  /** IDs do serviço (para API de avaliação, mensagens, etc.). */
  user_id: string;
  prestador_id: string;
  titulo: string;
  /** Neste contrato o utilizador atual é cliente ou prestador. */
  meuPapel: "cliente" | "prestador";
  /** A outra parte (profissional ou cliente). */
  counterparty: { name: string; role: string; city: string };
  category: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  durationDays: number;
  address: string;
  value: number;
  duracao: string;
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

export function RatingStars({ rating }: { rating: number | null | undefined }) {
  const hasRating = typeof rating === "number" && Number.isFinite(rating);
  const value = hasRating ? rating : 0;
  const full = Math.round(value);
  const label = hasRating ? value.toFixed(1).replace(".", ",") : "—";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              fontSize: "30px",
              color: hasRating && i <= full ? "#E0C271" : "#DEDEDE",
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
        {label}
      </span>
      <span
        style={{
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: "22px",
          color: "#8E8D8C",
        }}
      >
        {hasRating ? "avaliado" : "sem avaliação"}
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

export function ContractCard({
  contract,
  isVigente,
  displayRating,
  showPicker,
  onOpenPicker,
  onClosePicker,
  onRate,
  onContact,
  onVerDetalhes,
}: {
  contract: Contract;
  isVigente: boolean;
  displayRating: number | null | undefined;
  showPicker: boolean;
  onOpenPicker: () => void;
  onClosePicker: () => void;
  onRate: (r: number) => void;
  onContact: (servicoId: string) => void;
  onVerDetalhes: (servicoId: string) => void;
}) {
  const { status } = contract;
  const color  = statusColor[status];
  const bg     = statusBg[status];
  const label  = statusLabel[status];
  const icon   = statusIcon[status];
  const isRated =
    typeof displayRating === "number" && Number.isFinite(displayRating);

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
          <span
            style={{
              ...SF,
              padding: "5px 14px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              backgroundColor: contract.meuPapel === "cliente" ? "rgba(91,141,239,0.12)" : "rgba(224,194,113,0.2)",
              border: `1.5px solid ${contract.meuPapel === "cliente" ? "#5B8DEF" : "#C3A85E"}`,
              color: contract.meuPapel === "cliente" ? "#2e4a8f" : "#7a6220",
            }}
          >
            {contract.meuPapel === "cliente" ? "Contratante" : "Profissional"}
          </span>
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

      {/* ── Service title ── */}
      <div style={{ padding: "0 40px 8px" }}>
        <p style={{ ...SF, fontWeight: 700, fontSize: "34px", color: "#272727", margin: 0, lineHeight: 1.2 }}>
          {contract.titulo}
        </p>
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
            width: 56,
            height: 56,
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
            alt={contract.counterparty.name}
            width={56}
            height={56}
            style={{ display: "block" }}
          />
        </div>
        <div>
          <p style={{ ...SF, fontWeight: 500, fontSize: "18px", color: "#8E8D8C", margin: 0, marginBottom: "4px" }}>
            {contract.meuPapel === "cliente" ? "Profissional" : "Cliente"}
          </p>
          <p style={{ ...SF, fontWeight: 600, fontSize: "26px", color: "#272727", margin: 0, lineHeight: 1.2 }}>
            {contract.counterparty.name}
          </p>
          {contract.counterparty.role && (
            <p style={{ ...SF, fontWeight: 400, fontSize: "22px", color: "#8E8D8C", margin: 0, marginTop: "4px", lineHeight: 1 }}>
              {contract.counterparty.role}{contract.counterparty.city ? ` • ${contract.counterparty.city}` : ""}
            </p>
          )}
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
            <RatingStars rating={displayRating} />
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
            onClick={() => onContact(contract.id)}
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
          type="button"
          onClick={() => onVerDetalhes(contract.id)}
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

// ─── Map & fetch (partilhado) ─────────────────────────────────────────────────

const STATUS_MAP: Record<ServicoStatus, ContractStatus> = {
  criado:      "aguardando",
  emAndamento: "em_andamento",
  aceito:      "em_andamento",
  pendente:    "aguardando",
  finalizado:  "concluido",
  cancelado:   "cancelado",
  recusado:    "cancelado",
};

function formatDate(value: Date | string | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function parseOptionalNota(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  const n = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

/** Persiste a avaliação no backend e atualiza notas no serviço (nota_prestador / nota_usuario). */
export async function submitContractRating(contract: Contract, nota: number): Promise<void> {
  const destinatario = contract.meuPapel === "cliente" ? "prestador" : "usuario";
  await AvaliacaoGateway.criarAvaliacao({
    servico_id: contract.id,
    usuario_id: contract.user_id,
    prestador_id: contract.prestador_id,
    nota,
    comentario: undefined,
    media: undefined,
    destinatario,
  });
}

function mapServicoToContract(
  s: Servico,
  currentUserId: string,
  opts: { prestadorNome?: string; clienteNome?: string; categoriaNome?: string },
): Contract {
  const cat = opts.categoriaNome || s.categoria || "";
  const meuPapel: "cliente" | "prestador" = s.user_id === currentUserId ? "cliente" : "prestador";
  const counterparty =
    meuPapel === "cliente"
      ? {
          name: opts.prestadorNome || "Profissional",
          role: cat || "Serviço",
          city: "",
        }
      : {
          name: opts.clienteNome || "Cliente",
          role: cat || "Pedido de serviço",
          city: "",
        };

  const rating =
    meuPapel === "cliente"
      ? parseOptionalNota(s.nota_prestador ?? s.nota)
      : parseOptionalNota(s.nota_usuario ?? s.nota);

  return {
    id: s.id,
    user_id: s.user_id,
    prestador_id: s.prestador_id,
    titulo: s.titulo || "Serviço",
    meuPapel,
    counterparty,
    category: cat,
    status: (STATUS_MAP as Record<string, ContractStatus>)[s.status] ?? "aguardando",
    startDate: formatDate(s.data_inicio),
    endDate: "",
    durationDays: 0,
    address: s.duracao ? `Duração: ${s.duracao}` : "",
    value: Number(s.preco_acordado ?? 0),
    duracao: s.duracao || "",
    rating,
  };
}

const PASSADOS_STATUS: ContractStatus[] = ["concluido", "cancelado"];

export async function fetchContratosAgrupados(userId: string | null): Promise<{
  vigentes: Contract[];
  passados: Contract[];
}> {
  if (!userId) return { vigentes: [], passados: [] };
  try {
    const [comoUser, comoPrestador] = await Promise.all([
      ClientGateway.getServicosPorUser(userId).catch(() => []),
      ClientGateway.getServicosPorPrestador(userId).catch(() => []),
    ]);

    const porId = new Map<string, Servico>();
    [...comoUser, ...comoPrestador].forEach((s) => porId.set(s.id, s));
    const servicos = Array.from(porId.values());

    const prestadorIds = [...new Set(servicos.map((s) => s.prestador_id).filter(Boolean))];
    const clienteIds = [...new Set(servicos.map((s) => s.user_id).filter(Boolean))];
    const prestadorNomes: Record<string, string> = {};
    const clienteNomes: Record<string, string> = {};
    const categoriaNomes: Record<string, string> = {};

    const [, categorias] = await Promise.all([
      Promise.allSettled([
        ...prestadorIds.map(async (pid) => {
          const p = await ClientGateway.getPrestador(pid).catch(() => null);
          if (p?.nome) prestadorNomes[pid] = p.nome;
        }),
        ...clienteIds.map(async (cid) => {
          const u = await ClientGateway.getUsuario(cid).catch(() => null);
          if (u?.nome) clienteNomes[cid] = u.nome;
        }),
      ]),
      ClientGateway.getCategorias().catch(() => []),
    ]);
    categorias.forEach((c) => {
      categoriaNomes[c.id] = c.nome;
    });

    const contratos = servicos.map((s) =>
      mapServicoToContract(s, userId, {
        prestadorNome: prestadorNomes[s.prestador_id],
        clienteNome: clienteNomes[s.user_id],
        categoriaNome: categoriaNomes[s.categoria_id],
      }),
    );

    const vigentes = contratos.filter((c) => !PASSADOS_STATUS.includes(c.status));
    const passados = contratos.filter((c) => PASSADOS_STATUS.includes(c.status));
    return { vigentes, passados };
  } catch {
    return { vigentes: [], passados: [] };
  }
}
