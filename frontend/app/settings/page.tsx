"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteAccount from "./components/DeleteAccount";
import Help from "./components/Help";
import Language from "./components/Language";
import Payments from "./components/Payments";
import Personal from "./components/Personal";
import ThemeMode from "./components/ThemeMode";
import { useSession } from "@/lib/contexts/AuthContext";
import "./settings.css";

type SettingsMenuId =
  | "pessoais"
  | "pagamentos"
  | "idioma"
  | "tema"
  | "excluir"
  | "ajuda";

const sidebarMenus = [
  {
    id: "pessoais",
    label: "Informações pessoais",
    icon: "/images/iformacoespessoais.svg",
  },
  { id: "pagamentos", label: "Pagamentos", icon: "/images/pagamentos.svg" },
  { id: "idioma", label: "Idioma", icon: "/images/idioma.svg" },
  {
    id: "tema",
    label: "Modo claro/modo escuro",
    icon: "/images/modoclaro-escuro.svg",
  },
  {
    id: "excluir",
    label: "Excluir conta",
    icon: "/images/excluirconta.svg",
  },
  { id: "ajuda", label: "Ajuda", icon: "/images/ajuda.svg" },
] as const;

const menuTitles: Record<SettingsMenuId, string> = {
  pessoais: "Informações pessoais",
  pagamentos: "Pagamentos",
  idioma: "Idioma",
  tema: "Modo claro/modo escuro",
  excluir: "Excluir conta",
  ajuda: "Ajuda",
};

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useSession();

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const [activeTab, setActiveTab] = useState<"contratante" | "profissional">(
    "contratante",
  );
  const [activeMenu, setActiveMenu] = useState<SettingsMenuId>("pessoais");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleTabChange = (tab: "contratante" | "profissional") => {
    setActiveTab(tab);
  };

  const renderActiveSection = () => {
    switch (activeMenu) {
      case "pessoais":
        return <Personal />;
      case "pagamentos":
        return <Payments />;
      case "idioma":
        return <Language />;
      case "tema":
        return <ThemeMode />;
      case "excluir":
        return <DeleteAccount />;
      case "ajuda":
        return <Help />;
      default:
        return <Personal />;
    }
  };

  return (
    <div className="settings-page">
      <header className="home-header">
        <div className="home-header__logo-wrap">
          <Image
            src="/images/logo_domi.svg"
            alt="Logo DOMI"
            width={70}
            height={60}
            className="home-header__logo"
          />
        </div>
        <span className="home-header__brand">DOMI</span>

        <div className="home-mode-switch">
          <div
            className={`home-mode-switch__pill ${
              activeTab === "profissional"
                ? "home-mode-switch__pill--right"
                : ""
            }`}
          />
          <button
            type="button"
            onClick={() => handleTabChange("contratante")}
            className={`home-mode-switch__button ${
              activeTab === "contratante"
                ? "home-mode-switch__button--active"
                : ""
            }`}
          >
            Contratante
          </button>
          <button
            type="button"
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

        <div className="home-header__spacer" />

        <Image
          src="/images/profile_notify.svg"
          alt="Perfil"
          width={52}
          height={53}
          onClick={() => router.push("/profile")}
          className="home-header__profile"
        />

        <Image
          src="/images/navy.svg"
          alt="Menu"
          width={60}
          height={50}
          onClick={() => setMenuOpen((value) => !value)}
          className="home-header__menu"
        />
      </header>

      {menuOpen ? (
        <div onClick={() => setMenuOpen(false)} className="home-menu-overlay" />
      ) : null}

      <div
        className={`home-menu-panel${menuOpen ? " home-menu-panel--open" : ""}`}
      >
        <p className="home-menu-panel__greeting">Olá, Usuário!</p>

        {(() => {
          const textBottom = 60 + 55 + 10;
          const firstLineTop = textBottom + 20;
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
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={`line-${index}`}
                  className="home-menu-panel__divider"
                  style={{ top: `${firstLineTop + index * rowHeight}px` }}
                />
              ))}

              {menuItems.map((item, index) => {
                const rowTop = firstLineTop + index * rowHeight;
                const centerY = rowTop + rowHeight / 2;

                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      if (item.label === "Sair da conta") {
                        handleLogout();
                      } else if (item.href) {
                        router.push(item.href);
                      }
                    }}
                    className={`home-menu-item ${
                      item.hasSwitch
                        ? "home-menu-item--switch"
                        : "home-menu-item--link"
                    }`}
                    style={{ top: `${centerY}px` }}
                  >
                    <Image
                      src={`/images/${item.icon}`}
                      alt={item.label}
                      width={item.iconW}
                      height={item.iconH}
                      className="home-menu-item__icon"
                    />

                    <span className="home-menu-item__label">{item.label}</span>

                    {item.hasSwitch ? (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          setDarkMode((value) => !value);
                        }}
                        className={`home-menu-item__switch ${
                          darkMode ? "home-menu-item__switch--on" : ""
                        }`}
                      >
                        <div className="home-menu-item__switch-thumb" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>

      <main className="settings-main">
        <aside className="settings-sidebar">
          <h1 className="settings-sidebar__title">Configurações</h1>

          <nav className="settings-sidebar__nav">
            {sidebarMenus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                onClick={() => setActiveMenu(menu.id)}
                className={`settings-sidebar__button ${
                  activeMenu === menu.id
                    ? "settings-sidebar__button--active"
                    : ""
                }`}
              >
                <Image
                  src={menu.icon}
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
                <span>{menu.label}</span>
              </button>
            ))}
          </nav>

          <div className="settings-sidebar__footer">
            <button
              type="button"
              className="settings-sidebar__logout"
              onClick={handleLogout}
            >
              <span aria-hidden="true">←</span> Sair da conta
            </button>
          </div>
        </aside>

        <section className="settings-content">
          <div className="settings-content__header">
            <h2 className="settings-content__title">
              {menuTitles[activeMenu]}
            </h2>
            <button
              type="button"
              className="settings-content__back-btn"
              onClick={() => router.push("/home")}
            >
              Voltar para a Home
            </button>
          </div>

          {renderActiveSection()}
        </section>
      </main>
    </div>
  );
}
