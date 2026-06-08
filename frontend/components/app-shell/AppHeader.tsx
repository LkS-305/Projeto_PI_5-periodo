"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useHomeHub } from "@/components/app-shell/HomeHubContext";
import { CarteiraHeaderModeSwitch } from "@/components/app-shell/CarteiraHeaderModeSwitch";

type AppHeaderProps = {
  menuOpen: boolean;
  onOpenMenu: () => void;
  /** Enquanto o Suspense do shell carrega `useSearchParams` no interruptor da carteira. */
  carteiraSwitchFallback?: boolean;
};

function IconMenuHamburger() {
  return (
    <svg
      className="home-header__menu-svg"
      width="24"
      height="18"
      viewBox="0 0 24 18"
      aria-hidden
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        d="M1.25 2.25h21.5M1.25 9h21.5M1.25 15.75h21.5"
      />
    </svg>
  );
}

function IconUserCircle() {
  return (
    <svg
      className="home-header__profile-svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden
    >
      <circle cx="14" cy="14" r="12.25" fill="rgba(250,249,245,0.35)" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="14" cy="11" r="3.5" fill="currentColor" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M6.5 22.25c.75-4.25 4.25-6.5 7.5-6.5s6.75 2.25 7.5 6.5"
      />
    </svg>
  );
}

export function AppHeader({
  menuOpen,
  onOpenMenu,
  carteiraSwitchFallback = false,
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const homeHub = useHomeHub();
  const isCarteira = pathname === ROUTES.dashboard;
  /** Mesmo seletor do hub em todo o (app), não só na home. */
  const hub = homeHub;

  return (
    <header className="home-header">
      <Link
        href={ROUTES.landing}
        className="home-header__logo-wrap"
        prefetch={false}
        aria-label="Ir para a página inicial pública"
      >
        <Image
          src="/images/logo_domi.svg"
          alt="DOMI"
          width={70}
          height={60}
          className="home-header__logo"
        />
      </Link>

      <Link
        href={ROUTES.landing}
        className="home-header__brand"
        prefetch={false}
        aria-label="Ir para a página inicial pública"
      >
        DOMI
      </Link>

      {hub ? (
        <div className="home-mode-switch">
          <div
            className={`home-mode-switch__pill ${
              hub.activeTab === "profissional"
                ? "home-mode-switch__pill--right"
                : ""
            }`}
          />
          <button
            type="button"
            onClick={() => void hub.handleTabChange("contratante")}
            className={`home-mode-switch__button ${
              hub.activeTab === "contratante"
                ? "home-mode-switch__button--active"
                : ""
            }`}
          >
            Contratante
          </button>
          <button
            type="button"
            onClick={() => void hub.handleTabChange("profissional")}
            className={`home-mode-switch__button ${
              hub.activeTab === "profissional"
                ? "home-mode-switch__button--active"
                : ""
            }`}
          >
            Profissional
          </button>
        </div>
      ) : null}

      {isCarteira && !carteiraSwitchFallback ? <CarteiraHeaderModeSwitch /> : null}
      {isCarteira && carteiraSwitchFallback ? (
        <div
          className="home-mode-switch home-mode-switch--placeholder"
          aria-hidden
        />
      ) : null}

      <div className="home-header__spacer" />

      <button
        type="button"
        onClick={() => router.push(ROUTES.profile)}
        className="home-header__icon-btn home-header__profile"
        aria-label="Perfil"
      >
        <IconUserCircle />
      </button>

      <button
        type="button"
        onClick={onOpenMenu}
        className="home-header__icon-btn home-header__menu"
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
        aria-controls="app-slide-menu"
      >
        <IconMenuHamburger />
      </button>
    </header>
  );
}
