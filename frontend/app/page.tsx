"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/contexts/AuthContext";
import { ROUTES } from "@/lib/routes";
import "./landing.css";

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
] as const;

const PROVIDER_STEPS = [
  {
    title: "Monte seu perfil e portfólio",
    body: "Especialidades, projetos anteriores, região e disponibilidade.",
  },
  {
    title: "Receba propostas personalizadas",
    body: "Clientes chegam até você pelo match inteligente.",
  },
  {
    title: "Execute e envie o vídeo",
    body: "Vídeo do serviço concluído para validação e segurança.",
  },
  {
    title: "Receba e construa reputação",
    body: "Pagamento liberado, avaliações e reputação que atraem clientes.",
  },
] as const;

const FEATURE_ITEMS = [
  {
    icon: "puzzle.svg",
    title: "Match inteligente",
    desc: "Distância, especialidade, avaliação e disponibilidade para sugerir o profissional certo.",
    iconSize: 34,
  },
  {
    icon: "lock.svg",
    title: "Pagamento seguro",
    desc: "Valor retido na plataforma até a confirmação do serviço concluído.",
    iconSize: 30,
  },
  {
    icon: "film.svg",
    title: "Validação por vídeo",
    desc: "Profissional e contratante podem enviar vídeo do resultado. Transparência mútua.",
    iconSize: 34,
  },
  {
    icon: "stars.svg",
    title: "Reputação",
    desc: "Avaliações e portfólio com histórico verificável após cada serviço.",
    iconSize: 34,
  },
  {
    icon: "chat.svg",
    title: "Chat integrado",
    desc: "Negociação vinculada ao pedido, com histórico dentro da plataforma.",
    iconSize: 34,
  },
  {
    icon: "double.svg",
    title: "Demanda inteligente",
    desc: "Uma conta: alterne entre contratar e trabalhar quando precisar.",
    iconSize: 34,
  },
] as const;

const REVIEWS_TOP = [
  {
    stars: 5,
    quote:
      "Encontrei um eletricista excelente em menos de 2 horas. O match foi perfeito e o pagamento super seguro.",
    name: "Matheus S.",
    role: "Eletricista • São Paulo, SP",
  },
  {
    stars: 5,
    quote:
      "Como prestadora, recebi propostas alinhadas com meu perfil desde o primeiro dia.",
    name: "Carla M.",
    role: "Pintora • Rio de Janeiro, RJ",
  },
  {
    stars: 4,
    quote:
      "O sistema de vídeo de validação me deu muita segurança antes de liberar o pagamento.",
    name: "Ricardo T.",
    role: "Contratante • Curitiba, PR",
  },
  {
    stars: 5,
    quote:
      "Chat integrado e histórico de negociações deixam tudo muito mais organizado.",
    name: "Ana P.",
    role: "Designer • Contagem, MG",
  },
  {
    stars: 5,
    quote:
      "Minha reputação cresceu rápido. Os clientes chegam até mim qualificados.",
    name: "João V.",
    role: "Encanador • Porto Alegre, RS",
  },
  {
    stars: 4,
    quote:
      "Alternei entre contratar e trabalhar na mesma semana com uma conta só.",
    name: "Fernanda L.",
    role: "Contratante • Brasília, DF",
  },
] as const;

const REVIEWS_BOTTOM = [
  {
    stars: 5,
    quote:
      "Os clientes chegam pelo portfólio, não pelo menor preço. Mudou minha rotina.",
    name: "Lucas S.",
    role: "Marceneiro • São Paulo, SP",
  },
  {
    stars: 5,
    quote: "Muito mais trabalho graças à plataforma.",
    name: "Miguel A.",
    role: "Pintor • Manaus, AM",
  },
  {
    stars: 5,
    quote: "Prático para reformas e manutenção em casa.",
    name: "Jorge L.",
    role: "Contratante • Campinas, SP",
  },
  {
    stars: 5,
    quote:
      "Clientes qualificados que sabem o que querem. O portfólio faz a diferença.",
    name: "Mariana C.",
    role: "Arquiteta • Florianópolis, SC",
  },
  {
    stars: 4,
    quote:
      "Primeira vez contratando online com confiança. Tudo transparente do início ao fim.",
    name: "Roberto F.",
    role: "Contratante • Recife, PE",
  },
  {
    stars: 5,
    quote:
      "Em duas semanas avaliações positivas e novos pedidos. Reputação bem pensada.",
    name: "Tatiane B.",
    role: "Diarista • Belo Horizonte, MG",
  },
] as const;

type LandingReview = {
  readonly stars: number;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
};

function ReviewCard({ review }: { review: LandingReview }) {
  return (
    <article className="landing-review-card">
      <div className="landing-review-card__stars" aria-hidden>
        {Array.from({ length: 5 }).map((_, s) => (
          <Image
            key={s}
            src="/images/review.svg"
            alt=""
            width={18}
            height={18}
            style={{ opacity: s < review.stars ? 1 : 0.22 }}
          />
        ))}
      </div>
      <p className="landing-review-card__quote">{review.quote}</p>
      <div className="landing-review-card__footer">
        <Image src="/images/profile.svg" alt="" width={44} height={44} />
        <div>
          <div className="landing-review-card__name">{review.name}</div>
          <div className="landing-review-card__role">{review.role}</div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { isAuthenticated, loading } = useSession();
  const loggedIn = !loading && isAuthenticated;
  const [howRole, setHowRole] = useState<"contratante" | "prestador">(
    "contratante",
  );
  const howSteps =
    howRole === "contratante" ? CONTRACTOR_STEPS : PROVIDER_STEPS;

  const reviewsMarqueeLoop = useMemo(() => {
    const base = [...REVIEWS_TOP, ...REVIEWS_BOTTOM] as LandingReview[];
    return [...base, ...base];
  }, []);

  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="landing">
      <header className="landing-header">
        <Link
          href={ROUTES.landing}
          className="landing-header__brand-wrap"
          prefetch={false}
        >
          <Image src="/images/logo_domi.svg" alt="" width={44} height={38} />
          <span className="landing-header__title">DOMI</span>
        </Link>
        <span className="landing-header__sep" aria-hidden>
          |
        </span>

        <div className="landing-header__actions">
          <Link
            href={ROUTES.explore}
            className="landing-btn landing-btn--outline"
            prefetch={false}
          >
            Explorar
          </Link>
          {loggedIn ? (
            <Link
              href={ROUTES.hub}
              className="landing-btn landing-btn--solid"
              prefetch={false}
            >
              Home
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="landing-btn landing-btn--outline"
                prefetch={false}
              >
                Entrar
              </Link>
              <Link
                href={ROUTES.register}
                className="landing-btn landing-btn--solid"
                prefetch={false}
              >
                Cadastrar-se
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="landing-main">
        <section id="inicio" className="landing-section landing-hero">
          <div className="landing-hero__grid">
            <div>
              <h1 className="landing-hero__title">
                Conecte-se com quem faz bem feito.
              </h1>
              <p className="landing-hero__sub">
                Encontre profissionais de confiança ou ofereça seus serviços,
                com qualidade e segurança num só lugar.
              </p>
              <div className="landing-search">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#535353"
                  strokeWidth="2.2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  placeholder="Que serviço você precisa hoje?"
                  aria-label="Busca"
                />
                <Link
                  href={ROUTES.explore}
                  className="landing-search__cta"
                  prefetch={false}
                >
                  Procurar profissionais
                </Link>
              </div>
            </div>
            <div className="landing-hero__visual">
              <Image
                src="/images/phone_mockup.svg"
                alt="Pré-visualização do app DOMI"
                width={420}
                height={630}
                priority
              />
            </div>
          </div>
        </section>

        <section id="como-funciona" className="landing-section">
          <div className="landing-section__inner">
            <p className="landing-eyebrow">Como funciona</p>
            <h2 className="landing-h2">
              Simples para os dois lados da relação
            </h2>
            <p className="landing-lead">
              Uma conta, dois modos de uso. Escolha abaixo o fluxo e veja o
              passo a passo.
            </p>

            <div className="landing-how-alt">
              <div
                className="landing-how-alt__tabs"
                role="tablist"
                aria-label="Fluxo por tipo de utilizador"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-how-contratante"
                  aria-selected={howRole === "contratante"}
                  aria-controls="panel-how-steps"
                  className={`landing-how-alt__tab${howRole === "contratante" ? " landing-how-alt__tab--active" : ""}`}
                  onClick={() => setHowRole("contratante")}
                >
                  Contratante
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-how-prestador"
                  aria-selected={howRole === "prestador"}
                  aria-controls="panel-how-steps"
                  className={`landing-how-alt__tab${howRole === "prestador" ? " landing-how-alt__tab--active" : ""}`}
                  onClick={() => setHowRole("prestador")}
                >
                  Prestador
                </button>
              </div>

              <div
                id="panel-how-steps"
                role="tabpanel"
                aria-labelledby={
                  howRole === "contratante"
                    ? "tab-how-contratante"
                    : "tab-how-prestador"
                }
                className="landing-how-alt__panel"
              >
                <ol className="landing-how-alt__timeline">
                  {howSteps.map((step, i) => (
                    <li key={step.title} className="landing-how-alt__step">
                      <span className="landing-how-alt__dot">{i + 1}</span>
                      <div className="landing-how-alt__content">
                        <p className="landing-how-alt__title">{step.title}</p>
                        <p className="landing-how-alt__body">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="landing-section">
          <div className="landing-section__inner">
            <p className="landing-eyebrow">Recursos</p>
            <h2 className="landing-h2">
              Tudo o que você precisa em um só lugar
            </h2>
            <p className="landing-lead">
              Profissionais e clientes na mesma plataforma, com ferramentas
              pensadas para o dia a dia.
            </p>

            <div className="landing-features-grid">
              {FEATURE_ITEMS.map((item) => (
                <article key={item.title} className="landing-feature-card">
                  <div className="landing-feature-card__icon">
                    <Image
                      src={`/images/${item.icon}`}
                      alt=""
                      width={item.iconSize}
                      height={item.iconSize}
                    />
                  </div>
                  <h3 className="landing-feature-card__title">{item.title}</h3>
                  <p className="landing-feature-card__desc">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="avaliacoes"
          className="landing-section landing-section--reviews"
        >
          <div className="landing-section__inner">
            <div className="landing-reviews-intro">
              <p className="landing-eyebrow">Avaliações</p>
              <h2 className="landing-h2">Quem já usa, aprova</h2>
              <p className="landing-lead">
                Depoimentos em destaque, a percorrer o ecrã — com desvanecimento
                suave nas laterais.
              </p>
            </div>

            <div className="landing-reviews-marquee-stack">
              <div className="landing-reviews-marquee-wrap">
                <div className="landing-reviews-marquee-track landing-reviews-marquee-track--ltr">
                  {reviewsMarqueeLoop.map((r, i) => (
                    <div
                      key={`marquee-ltr-${i}-${r.name}`}
                      className="landing-reviews-marquee-item"
                    >
                      <ReviewCard review={r} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="landing-reviews-marquee-wrap">
                <div className="landing-reviews-marquee-track landing-reviews-marquee-track--rtl">
                  {reviewsMarqueeLoop.map((r, i) => (
                    <div
                      key={`marquee-rtl-${i}-${r.name}`}
                      className="landing-reviews-marquee-item"
                    >
                      <ReviewCard review={r} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-cta" id="comecar">
          <div className="landing-cta-card">
            <h2>Pronto para começar?</h2>
            <p>
              Cadastre-se gratuitamente e escolha como quer usar a{" "}
              <strong style={{ fontFamily: "Clash Display, Georgia, serif" }}>
                DOMI
              </strong>
              .
            </p>
            <div className="landing-cta-actions">
              {loggedIn ? (
                <Link
                  href={ROUTES.hub}
                  className="landing-btn landing-btn--solid"
                  prefetch={false}
                >
                  Ir para Home
                </Link>
              ) : (
                <>
                  <Link
                    href={ROUTES.register}
                    className="landing-btn landing-btn--solid"
                    prefetch={false}
                  >
                    Criar conta grátis
                  </Link>
                  <Link
                    href={ROUTES.login}
                    className="landing-btn landing-btn--ghost"
                    prefetch={false}
                  >
                    Já tenho conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer__grid">
          <div>
            <h2>DOMI</h2>
            <p
              style={{
                maxWidth: "36ch",
                lineHeight: 1.5,
                margin: 0,
                opacity: 0.9,
              }}
            >
              Encontre profissionais de confiança ou ofereça seus serviços, com
              qualidade e segurança.
            </p>
          </div>
          <div>
            <h3>Redes sociais</h3>
            <div className="landing-footer__social">
              {[
                {
                  src: "/images/Instagram.svg",
                  w: 44,
                  h: 44,
                  name: "Instagram",
                },
                { src: "/images/Youtube.svg", w: 52, h: 44, name: "YouTube" },
                { src: "/images/Twitter.svg", w: 44, h: 44, name: "Twitter" },
                { src: "/images/TikTok.svg", w: 40, h: 44, name: "TikTok" },
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
              <li>
                <a href="#como-funciona">Como funciona</a>
              </li>
              <li>
                <a href="#recursos">Recursos</a>
              </li>
              <li>
                <a href="#avaliacoes">Avaliações</a>
              </li>
              <li>
                <Link href={ROUTES.register} prefetch={false}>
                  Cadastrar-se
                </Link>
              </li>
              <li>
                <Link href={ROUTES.explore} prefetch={false}>
                  Explorar
                </Link>
              </li>
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
    </div>
  );
}
