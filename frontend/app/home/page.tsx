"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./home.css";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("contratante");
  const [tabVisible, setTabVisible] = useState(true);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    // 1. Fade out
    setTabVisible(false);
    // 2. Após a transição, troca o conteúdo e faz fade in
    setTimeout(() => {
      setActiveTab(tab);
      setTabVisible(true);
    }, 300);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="home-page">
      {/* ── CABEÇALHO ── */}
      <header className="home-header">
        {/* Logo imagem */}
        <div className="home-header__logo-wrap">
          <Image
            src="/images/logo_domi.svg"
            alt="Logo DOMI"
            width={70}
            height={60}
            className="home-header__logo"
          />
        </div>

        {/* Texto DOMI */}
        <span className="home-header__brand">DOMI</span>

        {/* ── SWITCH Contratante / Profissional ── */}
        <div className="home-mode-switch">
          {/* Pill animada */}
          <div
            className={`home-mode-switch__pill ${
              activeTab === "profissional"
                ? "home-mode-switch__pill--right"
                : ""
            }`}
          />

          {/* Botão Contratante */}
          <button
            onClick={() => handleTabChange("contratante")}
            className={`home-mode-switch__button ${
              activeTab === "contratante"
                ? "home-mode-switch__button--active"
                : ""
            }`}
          >
            Contratante
          </button>

          {/* Botão Profissional */}
          <button
            onClick={() => handleTabChange("profissional")}
            className={`home-mode-switch__button ${
              activeTab === "profissional"
                ? "home-mode-switch__button--active"
                : ""
            }`}
          >
            Profissional
          </button>
        </div>

        {/* Spacer */}
        <div className="home-header__spacer" />

        {/* profile_notify.svg */}
        <Image
          src="/images/profile_notify.svg"
          alt="Perfil"
          width={52}
          height={53}
          onClick={() => router.push("/profile")}
          className="home-header__profile"
        />

        {/* navy.svg — abre/fecha menu */}
        <Image
          src="/images/navy.svg"
          alt="Menu"
          width={60}
          height={50}
          onClick={() => setMenuOpen((v) => !v)}
          className="home-header__menu"
        />
      </header>

      {/* ── GLASS MENU PANEL ── */}
      {/* Overlay para fechar ao clicar fora — só ativo quando aberto */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="home-menu-overlay" />
      )}

      {/* Painel — sempre no DOM, entra/sai via translateX */}
      <div
        className={`home-menu-panel${menuOpen ? " home-menu-panel--open" : ""}`}
      >
        {/* Olá <usuário>! */}
        <p className="home-menu-panel__greeting">Olá, Usuário!</p>

        {/* ── Linhas divisórias + itens ── */}
        {/* As 6 linhas dividem a área abaixo do título em 5 células de 90px cada.
                Linha 1: 20px abaixo do texto
                Linhas 2–6: cada 90px depois da anterior.
                Itens ficam verticalmente centralizados no intervalo entre linhas. */}

        {(() => {
          // Estimativa do topo do texto "Olá": marginTop 60px, fontSize ~55px (com lineHeight)
          const textBottom = 60 + 55 + 10; // ≈ 125px do topo do painel
          const firstLineTop = textBottom + 20; // 20px abaixo do texto ≈ 145px
          const rowHeight = 90;

          const menuItems = [
            {
              icon: "message.svg",
              iconW: 42,
              iconH: 40,
              label: "Mensagens",
              hasSwitch: false,
              href: "/messages",
            },
            {
              icon: "settings.svg",
              iconW: 40,
              iconH: 40,
              label: "Configurações",
              hasSwitch: false,
              href: "/settings",
            },
            {
              icon: "mode.svg",
              iconW: 40,
              iconH: 40,
              label: "Modo escuro",
              hasSwitch: true,
              href: null,
            },
            {
              icon: "help.svg",
              iconW: 40,
              iconH: 40,
              label: "Ajuda",
              hasSwitch: false,
              href: null,
            },
            {
              icon: "logout.svg",
              iconW: 40,
              iconH: 40,
              label: "Sair da conta",
              hasSwitch: false,
              href: null,
            },
          ];

          return (
            <>
              {/* 6 linhas */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`line-${i}`}
                  className="home-menu-panel__divider"
                  style={{ top: `${firstLineTop + i * rowHeight}px` }}
                />
              ))}

              {/* 5 itens — centralizados verticalmente entre cada par de linhas */}
              {menuItems.map((item, i) => {
                const rowTop = firstLineTop + i * rowHeight;
                const centerY = rowTop + rowHeight / 2; // centro do intervalo
                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      if (item.href) router.push(item.href);
                    }}
                    className={`home-menu-item ${item.hasSwitch ? "home-menu-item--switch" : "home-menu-item--link"}`}
                    style={{ top: `${centerY}px` }}
                  >
                    {/* Ícone */}
                    <Image
                      src={`/images/${item.icon}`}
                      alt={item.label}
                      width={item.iconW}
                      height={item.iconH}
                      className="home-menu-item__icon"
                    />

                    {/* Label com underline on hover */}
                    <span className="home-menu-item__label">{item.label}</span>

                    {/* Switch para "Modo escuro" */}
                    {item.hasSwitch && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setDarkMode((v) => !v);
                        }}
                        className={`home-menu-item__switch ${darkMode ? "home-menu-item__switch--on" : ""}`}
                      >
                        {/* Círculo do switch */}
                        <div className="home-menu-item__switch-thumb" />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>

      {/* ── BARRA DE PESQUISA ── */}
      <div className="home-search-bar">
        <Image
          src="/images/Lupa.svg"
          alt="Buscar"
          width={50}
          height={50}
          className="home-search-bar__icon"
        />
        <input
          type="text"
          placeholder="Que serviço você precisa hoje?"
          className="home-search-bar__input"
        />
      </div>

      {/* ── WRAPPER ANIMADO DAS SEÇÕES ── */}
      <div className={`tab-content${tabVisible ? " visible" : ""}`}>
        {/* ════ SEÇÃO CONTRATANTE ════ */}
        {activeTab === "contratante" && (
          <div className="home-section">
            {/* Box 1 — Criar demanda inteligente */}
            <div className="home-card home-card--full">
              {/* Imagem + Título na mesma linha */}
              <div className="home-card__title-row">
                <Image
                  src="/images/ticket.svg"
                  alt="Criar demanda"
                  width={75}
                  height={75}
                  className="home-card__icon"
                />
                <p className="home-card__title">Criar demanda inteligente</p>
              </div>
              <p className="home-card__description home-card__description--full">
                Crie sua demanda inteligente com suas necessidades, localização
                e disponibilidade que a DOMI te ajuda a encontrar o profissional
                ideal!
              </p>
              <div className="home-card__expand home-card__expand--top">
                <Image
                  src="/images/expand.svg"
                  alt="Expandir"
                  width={50}
                  height={50}
                />
              </div>
            </div>

            {/* Row: Box 2 + Box 3 */}
            <div className="home-card-grid">
              {/* Box 2 — Meus contratos */}
              <div className="home-card home-card--half">
                <div className="home-card__title-row">
                  <Image
                    src="/images/deal.svg"
                    alt="Contratos"
                    width={125}
                    height={75}
                    className="home-card__icon"
                  />
                  <p className="home-card__title">Meus contratos</p>
                </div>
                <p className="home-card__description home-card__description--half">
                  Navegue pelos seus contratos antigos
                </p>
                <div className="home-card__expand home-card__expand--bottom">
                  <Image
                    src="/images/expand.svg"
                    alt="Expandir"
                    width={50}
                    height={50}
                  />
                </div>
              </div>

              {/* Box 3 — Explorar catálogo */}
              <div
                className="home-card home-card--half"
                onClick={() => router.push("/explore")}
              >
                <div className="home-card__title-row">
                  <Image
                    src="/images/explore.svg"
                    alt="Explorar"
                    width={75}
                    height={75}
                    className="home-card__icon"
                  />
                  <p className="home-card__title">Explorar catálogo</p>
                </div>
                <p className="home-card__description home-card__description--half">
                  Conheça os profissionais da plataforma explorando os perfis
                  deles no catálogo.
                </p>
                <div className="home-card__expand home-card__expand--bottom">
                  <Image
                    src="/images/expand.svg"
                    alt="Expandir"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ SEÇÃO PROFISSIONAL ════ */}
        {activeTab === "profissional" && (
          <div className="home-section">
            {/* Box 1 — Portifólio */}
            <div className="home-card home-card--full">
              <div className="home-card__title-row">
                <Image
                  src="/images/portifolio.svg"
                  alt="Portifólio"
                  width={112}
                  height={75}
                  className="home-card__icon"
                />
                <p className="home-card__title">Portifólio</p>
              </div>
              <p className="home-card__description home-card__description--full">
                Mantenha seu portifólio atualizado com seus trabalhos,
                localização e disponibilidade que a DOMI te ajuda a encontrar
                trabalhos ideais!
              </p>
              <div className="home-card__expand home-card__expand--top">
                <Image
                  src="/images/expand.svg"
                  alt="Expandir"
                  width={50}
                  height={50}
                />
              </div>
            </div>

            {/* Row: Box 2 + Box 3 */}
            <div className="home-card-grid">
              {/* Box 2 — Meus contratos */}
              <div className="home-card home-card--half">
                <div className="home-card__title-row">
                  <Image
                    src="/images/deal.svg"
                    alt="Contratos"
                    width={125}
                    height={75}
                    className="home-card__icon"
                  />
                  <p className="home-card__title">Meus contratos</p>
                </div>
                <p className="home-card__description home-card__description--half">
                  Navegue pelos seus contratos antigos
                </p>
                <div className="home-card__expand home-card__expand--bottom">
                  <Image
                    src="/images/expand.svg"
                    alt="Expandir"
                    width={50}
                    height={50}
                  />
                </div>
              </div>

              {/* Box 3 — Financeiro */}
              <div
                className="home-card home-card--half"
                onClick={() => router.push("/dashboard")}
              >
                <div className="home-card__title-row">
                  <Image
                    src="/images/wallet.svg"
                    alt="Financeiro"
                    width={77}
                    height={75}
                    className="home-card__icon"
                  />
                  <p className="home-card__title">Financeiro</p>
                </div>
                <p className="home-card__description home-card__description--half">
                  Fique de olho em seus ganhos com a plataforma.
                </p>
                <div className="home-card__expand home-card__expand--bottom">
                  <Image
                    src="/images/expand.svg"
                    alt="Expandir"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* fim tab-content */}
    </div>
  );
}
