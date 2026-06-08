"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  CarteiraClienteView,
  CarteiraPrestadorView,
} from "./components/CarteiraSections";
import { useWallet } from "@/utils/hooks/useWallet";
import { resolveCarteiraPapelFromQuery } from "@/lib/carteiraPapel";
import { ClientGateway } from "@/lib/gateways/ClientGateway";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import {
  ROUTES,
  contractDetailPath,
  messagesWithServico,
} from "@/lib/routes";
import type { Servico } from "@/types/entities/servico";
import { useSession } from "@/lib/contexts/AuthContext";
import "./dashboard.css";

function DashboardCarteiraInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const homeHub = useHomeHub();
  const { user } = useSession();

  const papelParam = searchParams.get("papel");
  const hubTab = homeHub?.activeTab;

  const papel = useMemo(
    () => resolveCarteiraPapelFromQuery(papelParam, hubTab),
    [papelParam, hubTab],
  );

  const { carteira, transacoes, loading, erro, refetch } = useWallet(papel);
  const [contratoServico, setContratoServico] = useState<Servico | null>(null);

  const contratoAtivoId = searchParams.get("contratoAtivo");
  const userId = user?.id ?? "";

  useEffect(() => {
    if (!contratoAtivoId) {
      setContratoServico(null);
      return;
    }
    let cancelled = false;
    ClientGateway.getServicoById(contratoAtivoId)
      .then((s) => {
        if (!cancelled) setContratoServico(s);
      })
      .catch(() => {
        if (!cancelled) setContratoServico(null);
      });
    return () => {
      cancelled = true;
    };
  }, [contratoAtivoId]);

  const dismissContratoBanner = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("contratoAtivo");
    const qs = p.toString();
    router.replace(qs ? `${ROUTES.dashboard}?${qs}` : ROUTES.dashboard, {
      scroll: false,
    });
  }, [router, searchParams]);

  const voltarHub = useCallback(() => {
    router.push(ROUTES.hub);
  }, [router]);

  return (
    <div className="dashboard-page">
      <main className="dashboard-main dashboard-main--single">
        <div className="dashboard-toolbar">
          <button type="button" className="dashboard-toolbar__back" onClick={voltarHub}>
            ← Voltar ao hub
          </button>
          <div className="dashboard-toolbar__titles">
            <h1 className="dashboard-toolbar__title">Carteira</h1>
            <p className="dashboard-toolbar__subtitle">
              {papel === "cliente"
                ? "Cartão, comprovantes e histórico de pagamentos (use o interruptor no topo para o modo profissional)."
                : "Conta bancária simulada, comprovantes e saldo / histórico (interruptor no topo)."}
            </p>
          </div>
        </div>

        <section className="dashboard-content dashboard-content--full">
          {contratoAtivoId && contratoServico ? (
            <div className="dashboard-contract-banner">
              <div>
                <strong className="dashboard-contract-banner__titulo">Contrato ativo</strong>
                <p className="dashboard-contract-banner__txt">
                  {contratoServico.titulo} — estado: <strong>{contratoServico.status}</strong>
                </p>
              </div>
              <div className="dashboard-contract-banner__acoes">
                <Link className="dashboard-contract-btn dashboard-contract-btn--fill" href={contractDetailPath(contratoServico.id)}>
                  Ver contrato
                </Link>
                <Link
                  className="dashboard-contract-btn dashboard-contract-btn--line"
                  href={messagesWithServico(contratoServico.id)}
                >
                  Mensagens
                </Link>
                <button type="button" className="dashboard-contract-btn dashboard-contract-btn--ghost" onClick={dismissContratoBanner}>
                  Fechar
                </button>
              </div>
            </div>
          ) : null}

          {loading ? (
            <p className="dashboard-loading-msg dashboard-loading-msg--inline">A carregar carteira…</p>
          ) : erro ? (
            <p className="dashboard-loading-msg dashboard-loading-msg--erro">{erro}</p>
          ) : !userId ? (
            <p className="dashboard-loading-msg">Inicie sessão para ver a carteira.</p>
          ) : papel === "cliente" ? (
            <CarteiraClienteView
              userId={userId}
              carteira={carteira}
              transacoes={transacoes}
              onAtualizado={refetch}
            />
          ) : (
            <CarteiraPrestadorView
              userId={userId}
              carteira={carteira}
              transacoes={transacoes}
              onAtualizado={refetch}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="dashboard-page dashboard-page--loading">
          <main className="dashboard-main dashboard-main--single">
            <p className="dashboard-loading-msg">A carregar carteira…</p>
          </main>
        </div>
      }
    >
      <DashboardCarteiraInner />
    </Suspense>
  );
}
