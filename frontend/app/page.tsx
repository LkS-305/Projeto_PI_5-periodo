"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/contexts/AuthContext";
import "./landing.css";

const SECTION_COUNT = 5;

const CONTRACTOR_STEPS = [
  {
    title: "Descreva o que precisa",
    body: "Crie uma demanda inteligente com suas preferências.",
  },
  {
    title: "Receba sugestões filtradas",
    body: "O sistema retorna profissionais por match, sem leilão público.",
  },
  {
    title: "Converse e negocie",
    body: "Toda comunicação dentro da plataforma, preços e prazos com segurança.",
  },
  {
    title: "Pague com segurança",
    body: "O valor fica retido e só é liberado com a confirmação do serviço.",
  },
];

const PROVIDER_STEPS = [
  {
    title: "Monte seu perfil e portifólio",
    body: "Adicione especialidades, projetos anteriores, configure sua região e disponibilidade.",
  },
  {
    title: "Receba propostas personalizadas",
    body: "Clientes chegam até você pelo match inteligente.",
  },
  {
    title: "Execute e envie o vídeo",
    body: "Grave um vídeo do serviço concluído para validação e garanta segurança.",
  },
  {
    title: "Receba e construa reputação",
    body: "Pagamento liberado, avaliação recíproca e boa reputação que atrai clientes.",
  },
];

const FEATURE_ITEMS = [
  {
    icon: "puzzle.svg",
    title: "Match inteligente",
    desc: "Algoritmo analisa distância, especialidade, avaliação e disponibilidade para sugerir o profissional certo.",
    iconSize: 35,
  },
  {
    icon: "lock.svg",
    title: "Pagamento seguro",
    desc: "Seu dinheiro fica retido pela plataforma e só é liberado após a confirmação do serviço concluído.",
    iconSize: 30,
  },
  {
    icon: "film.svg",
    title: "Validação por vídeo",
    desc: "O profissional e o contratante enviam um vídeo do serviço finalizado. Transparência mútua.",
    iconSize: 35,
  },
  {
    icon: "stars.svg",
    title: "Reputação",
    desc: "Avaliações recíprocas e contestações verificadas após cada serviço. Portifólio com datas e projetos reais.",
    iconSize: 35,
  },
  {
    icon: "chat.svg",
    title: "Chat integrado",
    desc: "Toda negociação dentro da plataforma, vinculada ao contrato. Histórico seguro e protegido.",
    iconSize: 35,
  },
  {
    icon: "double.svg",
    title: "Demanda inteligente",
    desc: "Uma conta, dois modos. Alterne entre Contratante e Profissional quando precisar.",
    iconSize: 35,
  },
] as const;

const REVIEWS_TOP = [
  {
    stars: 5,
    quote:
      "Encontrei um eletricista excelente em menos de 2 horas. O match foi perfeito e o pagamento super seguro. Recomendo demais!",
    name: "Matheus S.",
    role: "Eletricista • São Paulo, SP",
  },
  {
    stars: 5,
    quote:
      "Como prestadora, recebi propostas alinhadas com meu perfil desde o primeiro dia. A plataforma entende o que você oferece.",
    name: "Carla M.",
    role: "Pintora • Rio de Janeiro, RJ",
  },
  {
    stars: 4,
    quote:
      "O sistema de vídeo de validação me deu muita segurança. Sabia exatamente o que estava contratando antes de liberar o pagamento.",
    name: "Ricardo T.",
    role: "Contratante • Curitiba, PR",
  },
  {
    stars: 5,
    quote:
      "Nunca foi tão fácil fechar serviços. O chat integrado e o histórico de negociações deixam tudo muito mais organizado.",
    name: "Ana P.",
    role: "Designer de Interiores • Contagem, MG",
  },
  {
    stars: 5,
    quote:
      "Minha reputação cresceu rápido com as avaliações recíprocas. Os clientes chegam até mim, não preciso mais correr atrás.",
    name: "João V.",
    role: "Encanador • Porto Alegre, RS",
  },
  {
    stars: 4,
    quote:
      "Alternei entre contratar e trabalhar na mesma semana. Flexibilidade total com uma conta só. Isso faz toda a diferença.",
    name: "Fernanda L.",
    role: "Contratante • Brasília, DF",
  },
];

const REVIEWS_BOTTOM = [
  {
    stars: 5,
    quote:
      "Uma plataforma que não transforma trabalho em leilão. Os clientes chegam até mim pelo portfólio, não pelo menor preço.",
    name: "Lucas S.",
    role: "Marceneiro • São Paulo, SP",
  },
  {
    stars: 5,
    quote: "Tenho conseguido muito mais trabalho graças à plataforma, muito boa!",
    name: "Miguel A.",
    role: "Pintor • Manaus, AM",
  },
  {
    stars: 5,
    quote: "Melhor site para fazer reformas, muito prático.",
    name: "Jorge L.",
    role: "Contratante • Campinas, SP",
  },
  {
    stars: 5,
    quote:
      "Finalmente encontrei uma forma de mostrar meu trabalho de verdade. Os clientes chegam qualificados e sabem o que querem.",
    name: "Mariana C.",
    role: "Arquiteta • Florianópolis, SC",
  },
  {
    stars: 4,
    quote:
      "A validação por vídeo me deu coragem de contratar alguém pela primeira vez online. Tudo foi transparente do início ao fim.",
    name: "Roberto F.",
    role: "Contratante • Recife, PE",
  },
  {
    stars: 5,
    quote:
      "Em duas semanas já tinha avaliações positivas e novos clientes batendo na porta. O sistema de reputação é muito bem pensado.",
    name: "Tatiane B.",
    role: "Diarista • Belo Horizonte, MG",
  },
];

function ReviewCard({
  review,
}: {
  review: (typeof REVIEWS_TOP)[number];
}) {
  return (
    <div className="landing-review-card">
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: 5 }).map((_, s) => (
          <Image
            key={s}
            src="/images/review.svg"
            alt=""
            width={20}
            height={20}
            style={{ opacity: s < review.stars ? 1 : 0.25 }}
          />
        ))}
      </div>
      <p className="landing-review-card__quote">{review.quote}</p>
      <div className="landing-review-card__meta">
        <Image src="/images/profile.svg" alt="" width={44} height={44} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#faf9f5" }}>
            {review.name}
          </div>
          <div style={{ fontSize: "0.82rem", color: "#c3a85e" }}>{review.role}</div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  reviews,
  rtl,
}: {
  reviews: typeof REVIEWS_TOP;
  rtl?: boolean;
}) {
  const doubled = [...reviews, ...reviews];
  return (
    <div className="landing-marquee">
      <div
        className={`landing-marquee__track${rtl ? " landing-marquee__track--rtl" : ""}`}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, loading } = useSession();
  const loggedIn = !loading && isAuthenticated;

  const scrollRootRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= SECTION_COUNT) return;
    const el =
      sectionRefs.current[idx] ??
      (typeof document !== "undefined"
        ? document.getElementById(`landing-section-${idx}`)
        : null);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setHeroVisible(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const sections = SECTION_COUNT;
    const els = Array.from(
      { length: sections },
      (_, i) => document.getElementById(`landing-section-${i}`) as HTMLElement | null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const m = /^landing-section-(\d+)$/.exec(entry.target.id);
          if (!m) continue;
          const idx = Number(m[1]);
          const ratio = entry.intersectionRatio;
          if (!best || ratio > best.ratio) {
            best = { idx, ratio };
          }
        }
        if (best) {
          setActiveSection(best.idx);
          if (best.idx === 0) setHeroVisible(true);
        }
      },
      { root, threshold: [0.12, 0.22, 0.35, 0.5, 0.65], rootMargin: "-8% 0px -8% 0px" },
    );

    els.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <div ref={scrollRootRef} className="landing__snap-root">
      <header className="landing-header">
        <Link href="/" className="landing-header__logo" prefetch={false}>
          <Image src="/images/logo_domi.svg" alt="" width={44} height={38} />
          <span className="landing-header__brand">DOMI</span>
        </Link>

        <nav className="landing-header__nav" aria-label="Secções">
          {[
            { label: "Como funciona", idx: 1 },
            { label: "Recursos", idx: 2 },
            { label: "Avaliações", idx: 3 },
          ].map(({ label, idx }) => (
            <button key={label} type="button" onClick={() => goTo(idx)}>
              {label}
            </button>
          ))}
        </nav>

        <span className="landing-header__sep" aria-hidden="true">
          |
        </span>

        <div className="landing-header__actions">
          <Link href="/explore" className="landing-btn landing-btn--explore" prefetch={false}>
            Explorar
          </Link>
          {loggedIn ? (
            <Link href="/home" className="landing-btn landing-btn--solid" prefetch={false}>
              Home
            </Link>
          ) : (
            <>
              <Link href="/login" className="landing-btn landing-btn--outline" prefetch={false}>
                Entrar
              </Link>
              <Link href="/register" className="landing-btn landing-btn--solid" prefetch={false}>
                Cadastrar-se
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="landing-dots" role="tablist" aria-label="Navegação por secções">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`landing-dot${activeSection === i ? " landing-dot--active" : ""}`}
            aria-label={`Ir para secção ${i + 1}`}
            aria-current={activeSection === i ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* Hero */}
      <section
        id="landing-section-0"
        ref={setSectionRef(0)}
        className="landing-section landing-section--snap-full"
      >
        <div className="landing-hero">
          <div className="landing-hero__copy">
            <h1
              className={`landing-hero__title landing-fade-up${heroVisible ? " landing-fade-up--visible" : ""}`}
            >
              Conecte-se com quem faz bem feito.
            </h1>
            <p
              className={`landing-hero__sub landing-fade-up landing-fade-up--delay-1${heroVisible ? " landing-fade-up--visible" : ""}`}
            >
              Encontre profissionais de confiança ou ofereça seus serviços, tudo em um só lugar com
              qualidade e segurança.
            </p>
            <div
              className={`landing-search landing-fade-up landing-fade-up--delay-2${heroVisible ? " landing-fade-up--visible" : ""}`}
            >
              <div className="landing-search__box">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#535353"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input type="search" placeholder="Que serviço você precisa hoje?" aria-label="Busca" />
                <Link
                  href="/explore"
                  className="landing-search__cta"
                  prefetch={false}
                  style={{ textDecoration: "none" }}
                >
                  Procurar profissionais
                </Link>
              </div>
            </div>
          </div>
          <div className="landing-hero__visual">
            <Image
              src="/images/phone_mockup.svg"
              alt=""
              width={420}
              height={630}
              priority
            />
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section
        id="landing-section-1"
        ref={setSectionRef(1)}
        className="landing-section landing-section--snap-full landing-block"
      >
        <h2 className="landing-h2">Como funciona</h2>
        <h3 className="landing-h3">Simples para os dois lados da relação</h3>
        <p className="landing-lead">
          Uma conta, dois modos de uso. Alterne entre contratar e trabalhar quando quiser.
        </p>
        <div className="landing-how-grid">
          <div className="landing-glass-card">
            <p className="landing-glass-card__title">Contratante</p>
            {CONTRACTOR_STEPS.map((step, i) => (
              <div key={step.title} className="landing-step">
                <div className="landing-step__num">{i + 1}</div>
                <div className="landing-step__body">
                  <p>{step.title}</p>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="landing-glass-card">
            <p className="landing-glass-card__title">Prestador</p>
            {PROVIDER_STEPS.map((step, i) => (
              <div key={step.title} className="landing-step">
                <div className="landing-step__num">{i + 1}</div>
                <div className="landing-step__body">
                  <p>{step.title}</p>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section
        id="landing-section-2"
        ref={setSectionRef(2)}
        className="landing-section landing-section--snap-full landing-block"
      >
        <h2 className="landing-h2">Recursos</h2>
        <h3 className="landing-h3">Tudo o que você precisa em um só lugar</h3>
        <p className="landing-lead">
          Uma variedade de profissionais e clientes na mesma plataforma.
        </p>
        <div className="landing-features">
          <div className="landing-features__grid">
            {FEATURE_ITEMS.map((item) => (
              <div key={item.title} className="landing-feature-cell">
                <div className="landing-feature-cell__icon">
                  <Image
                    src={`/images/${item.icon}`}
                    alt=""
                    width={item.iconSize}
                    height={item.iconSize}
                  />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avaliações */}
      <section
        id="landing-section-3"
        ref={setSectionRef(3)}
        className="landing-section landing-section--snap-full landing-block"
      >
        <h2 className="landing-h2">Avaliações</h2>
        <h3 className="landing-h3">Quem já usa, aprova</h3>
        <p className="landing-lead">
          Uma conta, dois modos de uso. Alterne entre contratar e trabalhar quando quiser.
        </p>
        <div className="landing-reviews">
          <MarqueeRow reviews={REVIEWS_TOP} />
          <MarqueeRow reviews={REVIEWS_BOTTOM} rtl />
        </div>
      </section>

      {/* CTA + Footer */}
      <section
        id="landing-section-4"
        ref={setSectionRef(4)}
        className="landing-section landing-section--footer"
      >
        <div className="landing-cta-wrap">
          <div className="landing-cta-card">
            <h2>Pronto para começar?</h2>
            <p>
              Cadastre-se gratuitamente e escolha como quer usar a{" "}
              <strong style={{ fontFamily: "Clash Display, system-ui, sans-serif" }}>DOMI</strong>.
            </p>
            <div className="landing-cta-card__actions">
              {loggedIn ? (
                <Link href="/home" className="landing-btn landing-btn--solid" prefetch={false}>
                  Home
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="landing-btn landing-btn--solid"
                    prefetch={false}
                    style={{ minWidth: "min(100%, 280px)" }}
                  >
                    Criar conta grátis
                  </Link>
                  <Link href="/login" className="landing-btn landing-btn--outline" prefetch={false}>
                    Já tenho conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <div className="landing-footer__grid">
            <div>
              <h2 className="landing-footer__brand">DOMI</h2>
              <p className="landing-footer__copy">
                Encontre profissionais de confiança ou ofereça seus serviços, tudo em um só lugar com
                qualidade e segurança.
              </p>
            </div>
            <div>
              <h3>Redes sociais</h3>
              <div className="landing-footer__social">
                {[
                  { src: "/images/Instagram.svg", w: 48, h: 48, name: "Instagram" },
                  { src: "/images/Youtube.svg", w: 56, h: 48, name: "YouTube" },
                  { src: "/images/Twitter.svg", w: 48, h: 48, name: "Twitter" },
                  { src: "/images/TikTok.svg", w: 44, h: 48, name: "TikTok" },
                ].map((s) => (
                  <a key={s.name} href="#" aria-label={s.name}>
                    <Image src={s.src} alt="" width={s.w} height={s.h} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3>Produto</h3>
              <ul>
                {[
                  { label: "Como funciona", idx: 1 as const },
                  { label: "Recursos", idx: 2 as const },
                  { label: "Avaliações", idx: 3 as const },
                ].map((item) => (
                  <li key={item.label}>
                    <button type="button" onClick={() => goTo(item.idx)}>
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link href="/register" prefetch={false}>
                    Cadastrar-se
                  </Link>
                </li>
                <li>
                  <Link href="/explore" prefetch={false}>
                    Explorar prestadores
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>Empresa</h3>
              <ul>
                {["Sobre nós", "Carreiras", "Blog", "Imprensa"].map((item) => (
                  <li key={item}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Suporte</h3>
              <ul>
                <li>
                  <a href="#">Central de ajuda</a>
                </li>
                <li>
                  <Link href="/termos" prefetch={false}>
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" prefetch={false}>
                    Privacidade
                  </Link>
                </li>
                <li>
                  <a href="#">Contato</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="landing-footer__rule">
            © {new Date().getFullYear()} DOMI. Todos os direitos reservados.
          </div>
        </footer>
      </section>
    </div>
  );
}
