"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <header className="messages-header not-found-header">
        {/* Bloco da logo no topo */}
        <div className="messages-header__logo-wrap">
          <Image
            src="/images/logo_domi.svg"
            alt="DOMI"
            width={70}
            height={60}
            priority
          />
        </div>

        <span className="messages-header__brand">DOMI</span>
      </header>

      <section className="not-found-card">
        <p className="not-found-card__eyebrow">404</p>
        <h1 className="not-found-card__title">Página não encontrada</h1>
        <p className="not-found-card__description">
          A página que você tentou acessar não existe ou foi removida.
        </p>

        <div className="not-found-card__actions">
          <Link href="/" className="not-found-button not-found-button--primary">
            Ir para início
          </Link>
        </div>
      </section>
    </main>
  );
}
