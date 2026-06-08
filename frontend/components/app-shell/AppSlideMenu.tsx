"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import { ROUTES } from "@/lib/routes";

type MenuItem = {
  icon: string;
  iconW: number;
  iconH: number;
  label: string;
  href: string | null;
  variant?: "default" | "logout";
};

function menuItemsFor(carteiraHref: string): MenuItem[] {
  return [
    { icon: "paginainicial.svg", iconW: 28, iconH: 28, label: "Hub", href: ROUTES.hub },
    { icon: "explore.svg", iconW: 32, iconH: 32, label: "Explorar catálogo", href: ROUTES.explore },
    { icon: "ticket.svg", iconW: 32, iconH: 32, label: "Demanda inteligente", href: ROUTES.demand },
    { icon: "deal.svg", iconW: 32, iconH: 32, label: "Contratos", href: ROUTES.contracts },
    { icon: "wallet.svg", iconW: 32, iconH: 32, label: "Carteira", href: carteiraHref },
    { icon: "message.svg", iconW: 34, iconH: 32, label: "Mensagens", href: ROUTES.messages },
    { icon: "settings.svg", iconW: 32, iconH: 32, label: "Configurações", href: ROUTES.settings },
    { icon: "help.svg", iconW: 32, iconH: 32, label: "Ajuda", href: null },
    { icon: "logout.svg", iconW: 32, iconH: 32, label: "Sair da conta", href: null, variant: "logout" },
  ];
}

type AppSlideMenuProps = {
  open: boolean;
  onClose: () => void;
};

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        d="M5 5l12 12M17 5L5 17"
      />
    </svg>
  );
}

export function AppSlideMenu({ open, onClose }: AppSlideMenuProps) {
  const router = useRouter();
  const { logout, user } = useSession();
  const homeHub = useHomeHub();

  const items = useMemo(() => {
    const tab = homeHub?.activeTab;
    const papel = tab === "profissional" ? "prestador" : "cliente";
    const carteiraHref = `${ROUTES.dashboard}?papel=${papel}`;
    return menuItemsFor(carteiraHref);
  }, [homeHub?.activeTab]);

  const greeting =
    user && typeof user === "object" && "email" in user && user.email
      ? `Olá, ${String(user.email).split("@")[0]}!`
      : "Olá!";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.landing);
    onClose();
  };

  const handleRow = (item: MenuItem) => {
    if (item.label === "Sair da conta") handleLogout();
    else if (item.href) {
      router.push(item.href);
      onClose();
    }
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          className="home-menu-overlay"
          aria-label="Fechar menu"
          onClick={onClose}
        />
      ) : null}

      <aside
        id="app-slide-menu"
        className={`home-menu-panel${open ? " home-menu-panel--open" : ""}`}
        aria-hidden={!open}
        role="dialog"
        aria-modal={open}
        aria-label="Menu da conta"
      >
        <div className="home-menu-panel__top">
          <p className="home-menu-panel__greeting">{greeting}</p>
          <button
            type="button"
            className="home-menu-panel__close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <IconClose />
          </button>
        </div>

        <nav className="home-menu-nav" aria-label="Atalhos">
          <ul className="home-menu-list">
            {items.map((item) => {
              const isLogout = item.variant === "logout";
              const actionable = !!item.href || isLogout;
              return (
                <li key={item.label} className="home-menu-list__item">
                  <button
                    type="button"
                    className={`home-menu-list__btn${isLogout ? " home-menu-list__btn--logout" : ""}`}
                    onClick={() => handleRow(item)}
                    disabled={!actionable}
                  >
                    <span className="home-menu-list__icon-wrap">
                      <Image
                        src={`/images/${item.icon}`}
                        alt=""
                        width={item.iconW}
                        height={item.iconH}
                        className="home-menu-list__icon"
                      />
                    </span>
                    <span className="home-menu-list__label">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
