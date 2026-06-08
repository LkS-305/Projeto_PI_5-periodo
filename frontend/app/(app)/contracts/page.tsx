"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { ROUTES, contractDetailPath, messagesWithServico } from "@/lib/routes";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import {
  ContractCard,
  fetchContratosAgrupados,
  submitContractRating,
  type Contract,
} from "@/app/(app)/contracts/contractShared";

function ContractsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);
  const homeHub = useHomeHub();

  const [vigentes, setVigentes] = useState<Contract[]>([]);
  const [passadosCount, setPassadosCount] = useState(0);
  const [loadingContracts, setLoadingContracts] = useState(true);

  useEffect(() => {
    const aba = searchParams.get("aba");
    if (aba === "passados" || aba === "historico") {
      router.replace(ROUTES.servicosHistorico);
    }
  }, [searchParams, router]);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoadingContracts(false);
      return;
    }
    (async () => {
      const { vigentes: v, passados: p } = await fetchContratosAgrupados(userId);
      setVigentes(v);
      setPassadosCount(p.length);
      setLoadingContracts(false);
    })();
  }, []);

  const nComoCliente = useMemo(() => vigentes.filter((c) => c.meuPapel === "cliente").length, [vigentes]);
  const nComoPrestador = useMemo(() => vigentes.filter((c) => c.meuPapel === "prestador").length, [vigentes]);
  const vigentesFiltrados = useMemo(() => {
    if (!homeHub) return vigentes;
    if (homeHub.activeTab === "profissional") return vigentes.filter((c) => c.meuPapel === "prestador");
    return vigentes.filter((c) => c.meuPapel === "cliente");
  }, [vigentes, homeHub]);

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
        .contracts-root::-webkit-scrollbar { width: 6px; }
        .contracts-root::-webkit-scrollbar-track { background: rgba(39,39,39,0.08); border-radius: 3px; margin: 16px 0; }
        .contracts-root::-webkit-scrollbar-thumb { background: rgba(195,168,94,0.45); border-radius: 3px; }
        .contracts-root::-webkit-scrollbar-thumb:hover { background: rgba(195,168,94,0.75); }
        .contracts-root { scrollbar-width: thin; scrollbar-color: rgba(195,168,94,0.45) rgba(39,39,39,0.08); }
        .tab-btn { position: relative; background: none; border: none; cursor: pointer; padding: 0 0 14px; transition: color 0.2s; }
        .tab-btn::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 2px; background: #E0C271; transform: scaleX(0); transition: transform 0.25s cubic-bezier(0.645,0.045,0.355,1); }
        .tab-btn.active::after { transform: scaleX(1); }
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
            fontSize: "90px",
            color: "#E0C271",
            lineHeight: 1,
            margin: 0,
            letterSpacing: "-2px",
            marginBottom: "12px",
          }}
        >
          Meus Contratos
        </h1>
        <p style={{ ...SF, fontWeight: 500, fontSize: "30px", color: "#535353", margin: 0, marginBottom: "16px" }}>
          {vigentes.length} {vigentes.length === 1 ? "contrato vigente" : "contratos vigentes"} · {passadosCount}{" "}
          no histórico
        </p>
        <p style={{ ...SF, fontWeight: 500, fontSize: "22px", color: "#8E8D8C", margin: 0, marginBottom: "32px" }}>
          {nComoCliente} como <strong style={{ color: "#535353" }}>contratante</strong>
          {" · "}
          {nComoPrestador} como <strong style={{ color: "#535353" }}>profissional</strong>
          {" · "}
          Lista conforme o modo <strong style={{ color: "#535353" }}>Contratante / Profissional</strong> no topo.
        </p>

        <div style={{ display: "flex", gap: "0px", marginBottom: "48px", borderBottom: "2px solid #EAEAEA" }}>
          <button
            type="button"
            className="tab-btn active"
            style={{
              ...SF,
              fontWeight: 700,
              fontSize: "34px",
              color: "#272727",
              marginRight: "48px",
              paddingBottom: "14px",
            }}
          >
            Vigentes
            <span
              style={{
                marginLeft: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#272727",
                color: "#FAF9F5",
                fontSize: "22px",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {vigentesFiltrados.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => router.push(ROUTES.servicosHistorico)}
            className="tab-btn"
            style={{
              ...SF,
              fontWeight: 500,
              fontSize: "34px",
              color: "#8E8D8C",
              marginRight: "48px",
              paddingBottom: "14px",
            }}
          >
            Histórico
            <span
              style={{
                marginLeft: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#EAEAEA",
                color: "#8E8D8C",
                fontSize: "22px",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {passadosCount}
            </span>
          </button>
        </div>

        <div className="cards-list" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          {loadingContracts ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <p style={{ ...SF, fontSize: "32px", color: "#8E8D8C", margin: 0 }}>Carregando contratos...</p>
            </div>
          ) : vigentesFiltrados.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "18px" }}>
              <p style={{ ...SF, fontSize: "32px", color: "#8E8D8C", margin: 0, textAlign: "center", maxWidth: "520px" }}>
                {vigentes.length === 0
                  ? "Você não tem contratos ativos no momento."
                  : homeHub?.activeTab === "profissional"
                    ? "Nenhum contrato vigente como profissional neste modo. Troque para Contratante no topo da página para ver os outros."
                    : "Nenhum contrato vigente como contratante neste modo. Troque para Profissional no topo da página para ver os outros."}
              </p>
              {vigentes.length === 0 ? (
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
            vigentesFiltrados.map((contract) => {
              const displayRating =
                ratings[contract.id] !== undefined ? ratings[contract.id] : contract.rating;
              return (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  isVigente
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
                        const { vigentes: v, passados: p } = await fetchContratosAgrupados(uid);
                        setVigentes(v);
                        setPassadosCount(p.length);
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

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div
          className="contracts-root"
          style={{
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "#FAF9F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            color: "#8E8D8C",
            fontSize: "28px",
          }}
        >
          A carregar…
        </div>
      }
    >
      <ContractsPageInner />
    </Suspense>
  );
}
