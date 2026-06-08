"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { ROUTES, contractDetailPath, messagesWithServico } from "@/lib/routes";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import {
  ContractCard,
  fetchContratosAgrupados,
  submitContractRating,
  type Contract,
} from "@/app/(app)/contracts/contractShared";

export default function ServicosHistoricoPage() {
  const router = useRouter();
  const homeHub = useHomeHub();
  const [passados, setPassados] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    (async () => {
      const { passados: p } = await fetchContratosAgrupados(userId);
      setPassados(p);
      setLoading(false);
    })();
  }, []);

  const nComoCliente = useMemo(() => passados.filter((c) => c.meuPapel === "cliente").length, [passados]);
  const nComoPrestador = useMemo(() => passados.filter((c) => c.meuPapel === "prestador").length, [passados]);
  const passadosFiltrados = useMemo(() => {
    if (!homeHub) return passados;
    if (homeHub.activeTab === "profissional") return passados.filter((c) => c.meuPapel === "prestador");
    return passados.filter((c) => c.meuPapel === "cliente");
  }, [passados, homeHub]);

  const SF: React.CSSProperties = { fontFamily: "'SF Pro Text', system-ui, sans-serif" };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
      className="contracts-root"
    >
      <style>{`
        .contracts-root::-webkit-scrollbar { width: 6px; }
        .contracts-root::-webkit-scrollbar-track { background: rgba(39,39,39,0.08); border-radius: 3px; margin: 16px 0; }
        .contracts-root::-webkit-scrollbar-thumb { background: rgba(195,168,94,0.45); border-radius: 3px; }
        .contracts-root::-webkit-scrollbar-thumb:hover { background: rgba(195,168,94,0.75); }
        .contracts-root { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.08); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .cards-list { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      <div style={{ paddingLeft: "105px", paddingRight: "105px", paddingTop: "50px", paddingBottom: "100px" }}>
        <div
          onClick={() => router.push(ROUTES.hub)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "28px",
            fontWeight: 500,
            color: "#535353",
            cursor: "pointer",
            marginBottom: "22px",
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
            fontSize: "clamp(48px, 8vw, 90px)",
            color: "#E0C271",
            lineHeight: 1,
            margin: 0,
            letterSpacing: "-2px",
            marginBottom: "12px",
          }}
        >
          Histórico de serviços
        </h1>
        <p style={{ ...SF, fontWeight: 500, fontSize: "clamp(20px, 2.5vw, 30px)", color: "#535353", margin: 0, marginBottom: "12px", maxWidth: "720px" }}>
          Serviços concluídos ou encerrados em que participou como contratante ou como profissional.
        </p>
        <p style={{ ...SF, fontWeight: 500, fontSize: "22px", color: "#8E8D8C", margin: 0, marginBottom: "24px" }}>
          {passados.length}{" "}
          {passados.length === 1 ? "registo no histórico" : "registos no histórico"} · {nComoCliente} como contratante ·{" "}
          {nComoPrestador} como profissional · Lista conforme o modo{" "}
          <strong style={{ color: "#535353" }}>Contratante / Profissional</strong> no topo ·{" "}
          <button
            type="button"
            onClick={() => router.push(ROUTES.contracts)}
            style={{
              ...SF,
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              color: "#C3A85E",
              fontWeight: 600,
              textDecoration: "underline",
              fontSize: "22px",
            }}
          >
            Ver contratos em curso
          </button>
        </p>

        <div className="cards-list" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <p style={{ ...SF, fontSize: "32px", color: "#8E8D8C", margin: 0 }}>A carregar histórico…</p>
            </div>
          ) : passadosFiltrados.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "18px" }}>
              <p style={{ ...SF, fontSize: "32px", color: "#8E8D8C", margin: 0, textAlign: "center", maxWidth: "520px" }}>
                {passados.length === 0
                  ? "Ainda não há serviços concluídos ou cancelados no seu histórico."
                  : homeHub?.activeTab === "profissional"
                    ? "Nenhum registo encerrado como profissional neste modo. Troque para Contratante no topo da página para ver os outros."
                    : "Nenhum registo encerrado como contratante neste modo. Troque para Profissional no topo da página para ver os outros."}
              </p>
              {passados.length === 0 ? (
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.explore)}
                  style={{
                    padding: "16px 40px",
                    borderRadius: "50px",
                    backgroundColor: "#E0C271",
                    border: "none",
                    ...SF,
                    fontWeight: 600,
                    fontSize: "28px",
                    color: "#272727",
                    cursor: "pointer",
                  }}
                >
                  Explorar profissionais
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.hub)}
                  style={{
                    padding: "14px 32px",
                    borderRadius: "50px",
                    backgroundColor: "transparent",
                    border: "2px solid #272727",
                    ...SF,
                    fontWeight: 600,
                    fontSize: "24px",
                    color: "#272727",
                    cursor: "pointer",
                  }}
                >
                  Ir ao hub
                </button>
              )}
            </div>
          ) : (
            passadosFiltrados.map((contract) => {
              const displayRating =
                ratings[contract.id] !== undefined ? ratings[contract.id] : contract.rating;
              return (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  isVigente={false}
                  displayRating={displayRating}
                  showPicker={pickerOpen === contract.id}
                  onOpenPicker={() => setPickerOpen(contract.id)}
                  onClosePicker={() => setPickerOpen(null)}
                  onRate={async (r) => {
                    try {
                      await submitContractRating(contract, r);
                      setRatings((prev) => ({ ...prev, [contract.id]: r }));
                      setPickerOpen(null);
                      const uid = getCurrentUserId();
                      if (uid) {
                        const { passados: p } = await fetchContratosAgrupados(uid);
                        setPassados(p);
                      }
                    } catch (e) {
                      window.alert(
                        e instanceof Error ? e.message : "Não foi possível guardar a avaliação.",
                      );
                    }
                  }}
                  onContact={(id) => router.push(messagesWithServico(id))}
                  onVerDetalhes={(id) => router.push(contractDetailPath(id))}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
