"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useSession } from "@/lib/contexts/AuthContext";

type MvpShellProps = {
  children: ReactNode;
  /** Se definido, mostra botão voltar (router.push) */
  backHref?: string;
  backLabel?: string;
};

export function MvpShell({
  children,
  backHref,
  backLabel = "← Voltar",
}: MvpShellProps) {
  const router = useRouter();
  const { isAuthenticated, logout } = useSession();

  return (
    <div className="mvp-shell">
      <header className="mvp-header">
        <div className="mvp-header__left">
          {backHref ? (
            <button
              type="button"
              className="mvp-btn mvp-btn--ghost"
              onClick={() => router.push(backHref)}
            >
              {backLabel}
            </button>
          ) : null}
          <Link href="/" className="mvp-header__brand" prefetch={false}>
            <Image src="/images/logo_domi.svg" alt="" width={40} height={34} />
            <span>DOMI</span>
          </Link>
        </div>

        <nav className="mvp-header__nav" aria-label="Navegação principal">
          <Link href="/explore" className="mvp-nav-link" prefetch={false}>
            Explorar
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="mvp-nav-link" prefetch={false}>
                Dashboard
              </Link>
              <Link href="/messages" className="mvp-nav-link" prefetch={false}>
                Mensagens
              </Link>
              <button
                type="button"
                className="mvp-nav-link"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="mvp-nav-link mvp-nav-link--primary"
              prefetch={false}
            >
              Entrar
            </Link>
          )}
        </nav>
      </header>
      {children}
    </div>
  );
}
