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
import { ROUTES } from "@/lib/routes";
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
    label: "Perfil",
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
  pessoais: "Perfil",
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
    router.push(ROUTES.landing);
  };
  const [activeMenu, setActiveMenu] = useState<SettingsMenuId>("pessoais");
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
              onClick={() => router.push(ROUTES.hub)}
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
