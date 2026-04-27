"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Overview from "./components/Overview";
import Balances from "./components/Balances";
import Transactions from "./components/Transactions";
import "./dashboard.css";

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    "overview" | "balances" | "transactions"
  >("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview onViewBalances={() => setActiveSection("balances")} />;
      case "balances":
        return <Balances />;
      case "transactions":
        return <Transactions />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header__logo-wrap">
          <Image
            src="/images/logo_domi.svg"
            alt="DOMI"
            width={70}
            height={60}
            priority
          />
        </div>

        <span className="dashboard-header__brand">DOMI</span>

        <button
          type="button"
          onClick={() => router.push("/home")}
          className="dashboard-header__back"
        >
          ← Voltar
        </button>
      </header>

      <main className="dashboard-main">
        <aside className="dashboard-sidebar">
          <h1 className="dashboard-sidebar__title">Dashboard</h1>

          <div className="dashboard-sidebar__nav">
            <button
              type="button"
              onClick={() => setActiveSection("overview")}
              className={`dashboard-sidebar__button ${
                activeSection === "overview"
                  ? "dashboard-sidebar__button--active"
                  : ""
              }`}
            >
              <Image
                src="/images/paginainicial.svg"
                alt="PaginaInicial"
                width={30}
                height={30}
              />
              <span>Página inicial</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("balances")}
              className={`dashboard-sidebar__button ${
                activeSection === "balances"
                  ? "dashboard-sidebar__button--active"
                  : ""
              }`}
            >
              <Image
                src="/images/saldos.svg"
                alt="Saldo"
                width={30}
                height={30}
              />
              <span>Saldos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("transactions")}
              className={`dashboard-sidebar__button ${
                activeSection === "transactions"
                  ? "dashboard-sidebar__button--active"
                  : ""
              }`}
            >
              <Image
                src="/images/transacoes.svg"
                alt="Transacoes"
                width={30}
                height={30}
              />
              <span>Transações</span>
            </button>
          </div>
        </aside>

        <section className="dashboard-content">{renderSection()}</section>
      </main>
    </div>
  );
}
