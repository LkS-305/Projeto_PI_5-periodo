"use client";

import Image from "next/image";
import { useState } from "react";
import Overview from "./components/Overview";
import Balances from "./components/Balances";
import Transactions from "./components/Transactions";
import ServicosPanel from "./components/ServicosPanel";
import { useWallet } from "@/utils/hooks/useWallet";
import { MvpShell } from "@/components/MvpShell";
import "./dashboard.css";

type Section =
  | "overview"
  | "servicos"
  | "balances"
  | "transactions"
  | "messages";

export default function DashboardPage() {
  const { carteira, transacoes, loading: walletLoading, erro: walletErro } =
    useWallet();
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <Overview
            onViewBalances={() => setActiveSection("balances")}
            carteira={carteira}
            transacoes={transacoes}
          />
        );
      case "servicos":
        return <ServicosPanel />;
      case "balances":
        return <Balances carteira={carteira} transacoes={transacoes} />;
      case "transactions":
        return <Transactions transacoes={transacoes} />;
      default:
        return (
          <Overview
            onViewBalances={() => setActiveSection("balances")}
            carteira={carteira}
            transacoes={transacoes}
          />
        );
    }
  };

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: "overview", label: "Visão geral", icon: "/images/paginainicial.svg" },
    { id: "servicos", label: "Serviços", icon: "/images/transacoes.svg" },
    { id: "balances", label: "Carteira", icon: "/images/saldos.svg" },
    { id: "transactions", label: "Transações", icon: "/images/transacoes.svg" },
  ];

  return (
    <MvpShell>
      <div className="dashboard-page dashboard-page--mvp">
        <main className="dashboard-main">
          <aside className="dashboard-sidebar">
            <h1 className="dashboard-sidebar__title">Dashboard</h1>

            <div className="dashboard-sidebar__nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`dashboard-sidebar__button ${
                    activeSection === item.id
                      ? "dashboard-sidebar__button--active"
                      : ""
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="dashboard-content">
            {walletErro ? (
              <div
                className="mvp-alert mvp-alert--error"
                role="alert"
                style={{ marginBottom: "1rem" }}
              >
                {walletErro}
              </div>
            ) : null}
            {walletLoading &&
            (activeSection === "overview" ||
              activeSection === "balances" ||
              activeSection === "transactions") ? (
              <p className="mvp-subtitle" style={{ marginBottom: "1rem" }}>
                A carregar carteira e transações…
              </p>
            ) : null}
            {renderSection()}
          </section>
        </main>
      </div>
    </MvpShell>
  );
}
