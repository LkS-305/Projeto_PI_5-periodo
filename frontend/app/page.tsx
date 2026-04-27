"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useAppScale } from "@/hooks/useAppScale";

export default function Home() {
  // Escala proporcional para sempre renderizar em 1920x1080
  const { scale, offsetX, BASE_WIDTH, BASE_HEIGHT } = useAppScale();

  // 1. O Estado (qual seção está visível)
  const [activeSection, setActiveSection] = useState(0);

  // 2. A trava invisível (único Ref que precisamos agora)
  const isScrolling = useRef(false);
  const TOTAL_SECTIONS = 5;

  // 3. Função de Navegação
  const goTo = (idx: number) => {
    if (idx < 0 || idx >= TOTAL_SECTIONS || isScrolling.current) return;

    isScrolling.current = true;
    setActiveSection(idx); // O estado atualiza, o CSS reage!

    setTimeout(() => {
      isScrolling.current = false;
    }, 950);
  };

  // 4. Gatilho do Mouse
  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling.current) return;
    if (e.deltaY > 0) {
      goTo(activeSection + 1);
    } else if (e.deltaY < 0) {
      goTo(activeSection - 1);
    }
  };

  // 5. Helper para checar seção ativa e disparar animações
  const v = (s: number) => activeSection === s;

  return (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "fixed",
      top: 0,
      left: 0,
      backgroundColor: "#FAF9F5",
    }}
  >
    <div
      style={{
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        position: "absolute",
        top: 0,
        left: offsetX,
      }}
    >
        <div
          onWheel={handleWheel}
          style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden", // Tranca a tela perfeitamente
            position: "relative",
          }}
        >
          {/* ── ESTILOS DAS ANIMAÇÕES EM CASCATA ── */}
          <style>{`
        .hero-title, .hero-sub, .search-row {
          opacity: 0;
          transform: translateY(32px);
        }
        
        /* Quando a classe .v entra em cena, eles aparecem */
        .hero-title.v, .hero-sub.v, .search-row.v {
          opacity: 1;
          transform: translateY(0);
        }

        /* Os delays escalonados (a coreografia) */
        .hero-title { transition: opacity .75s ease 0s, transform .75s ease 0s; }
        .hero-sub   { transition: opacity .75s ease .15s, transform .75s ease .15s; }
        .search-row { transition: opacity .75s ease .25s, transform .75s ease .25s; }

        /* ── CARROSSEL DE REVIEWS ── */
        /* Cada faixa tem 6 cards × (590px + 20px gap) = 3660px por set */
        @keyframes scroll-ltr {
          0%   { transform: translateX(-3660px); }
          100% { transform: translateX(0); }
        }
        @keyframes scroll-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-3660px); }
        }

        .carousel-track-ltr {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: scroll-ltr 90s linear infinite;
        }
        .carousel-track-rtl {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: scroll-rtl 90s linear infinite;
        }
      `}</style>

          {/* ── DOT NAVIGATION (Movido para fora das seções, fica fixo na tela) ── */}
          <div
            style={{
              position: "fixed",
              right: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              zIndex: 50,
            }}
          >
            {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: activeSection === i ? "#E0C271" : "rgba(39, 39, 39, 0.2)",
                  transform: activeSection === i ? "scale(1.4)" : "scale(1)",
                  transition: "all 0.3s ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={`Ir para seção ${i + 1}`}
              />
            ))}
          </div>

          {/* ── TRILHO DE ANIMAÇÃO (A mágica acontece aqui) ── */}
          <div
            style={{
              // Move a tela inteira com base na seção ativa (0, -100vh, -200vh, etc)
              transform: `translateY(-${activeSection * 100}vh)`,
              transition: "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)",
              width: "100%",
            }}
          >
            {/* ─── SEÇÃO 1 ─── */}
            <section
              style={{
                width: "100%",
                height: "100vh", // Força exatamente 1 tela de altura
                backgroundColor: "#FAF9F5",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* CABEÇALHO */}
              <header
                style={{
                  width: "100%",
                  height: "90px",
                  backgroundColor: "#E0C271",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 10,
                }}
              >
                {/* ── LOGO IMAGEM ── */}
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "40px",
                    zIndex: 20,
                  }}
                >
                  <Image
                    src="/images/logo_domi.svg"
                    alt="Logo DOMI"
                    width={70}
                    height={60}
                    style={{ display: "block" }}
                  />
                </div>

                {/* Logo DOMI */}
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 700,
                    fontSize: "70px",
                    color: "#272727",
                    lineHeight: 1,
                    marginLeft: "130px",
                    letterSpacing: "-1px",
                    userSelect: "none",
                  }}
                >
                  DOMI
                </span>

                {/* Nav links */}
                <nav
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "80px",
                    marginLeft: "auto",
                    marginRight: "40px",
                  }}
                >
                  {[
                    { label: "Como funciona", idx: 1 },
                    { label: "Recursos", idx: 2 },
                    { label: "Avaliações", idx: 3 },
                  ].map(({ label, idx }) => (
                    <button
                      key={label}
                      onClick={() => goTo(idx)}
                      style={{
                        fontFamily: "'SF Pro Text', system-ui, sans-serif",
                        fontWeight: 400,
                        fontSize: "30px",
                        color: "#272727",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        whiteSpace: "nowrap",
                        textDecoration: "none",
                        transition: "text-decoration 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {/* ── SEPARADOR DECORATIVO ── */}
                <span
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 100,
                    fontSize: "60px",
                    color: "#C3A85E",
                    marginRight: "40px",
                    marginTop: "-6px",
                    userSelect: "none",
                    lineHeight: 0.8,
                  }}
                >
                  |
                </span>

                {/* Botões */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "40px",
                  }}
                >
                  <a
                    href="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "145px",
                      height: "50px",
                      borderRadius: "50px",
                      backgroundColor: "transparent",
                      border: "3px solid #C3A85E",
                      textDecoration: "none",
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: "30px",
                      color: "#272727",
                      flexShrink: 0,
                      transition: "transform 0.2s ease, background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.07)";
                      e.currentTarget.style.backgroundColor = "#C3A85Es";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Entrar
                  </a>

                  <a
                    href="/register"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "220px",
                      height: "50px",
                      borderRadius: "50px",
                      marginRight: "40px",
                      backgroundColor: "#FAF9F5",
                      textDecoration: "none",
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 500,
                      fontSize: "30px",
                      color: "#E0C271",
                      flexShrink: 0,
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Cadastrar-se
                  </a>
                </div>
              </header>

              {/* ── PHONE ── */}
              <div
                style={{
                  position: "absolute",
                  top: "180px",
                  right: "40px",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              >
                <Image
                  src="/images/phone_mockup.svg"
                  alt="App DOMI no celular"
                  width={600}
                  height={900}
                  priority
                  style={{ display: "block" }}
                />
              </div>

              {/* ── CONTEÚDO HERO ── */}
              <div
                style={{
                  paddingLeft: "115px",
                  paddingTop: "80px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <h1
                  className={`hero-title${v(0) ? " v" : ""}`}
                  style={{
                    fontFamily: "'SF Pro Display', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "130px",
                    color: "#272727",
                    lineHeight: 1.0,
                    maxWidth: "1169px",
                    margin: 0,
                    marginLeft: "-70px",
                    letterSpacing: "-3px",
                  }}
                >
                  Conecte-se com quem faz bem feito.
                </h1>

                <p
                  className={`hero-sub${v(0) ? " v" : ""}`}
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "33px",
                    color: "#535353",
                    lineHeight: 1.4,
                    maxWidth: "1125px",
                    marginTop: "35px",
                    marginBottom: 0,
                    marginLeft: "-70px",
                  }}
                >
                  Encontre profissionais de confiança ou ofereça seus serviços, tudo
                  em um só lugar com qualidade e segurança.
                </p>
              </div>

              {/* ── FAKE SEARCH BAR ── */}
              <div
                className={`search-row${v(0) ? " v" : ""}`}
                style={{
                  position: "relative",
                  zIndex: 1,
                  marginTop: "80px",
                  marginLeft: "40px",
                }}
              >
                <div
                  style={{
                    width: "1310px",
                    height: "105px",
                    backgroundColor: "#EAEAEA",
                    boxShadow: "0px 20px 35px rgba(0, 0, 0, 0.25)",
                    borderRadius: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: "60px",
                    paddingRight: "20px",
                  }}
                >
                  <svg
                    width="45"
                    height="45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#535353"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginRight: "15px" }}
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>

                  <input
                    type="text"
                    placeholder="Que serviço você precisa hoje?"
                    style={{
                      flex: 1,
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: "40px",
                      color: "#535353",
                      marginRight: "30px",
                    }}
                  />

                  <div
                    style={{
                      width: "480px",
                      height: "70px",
                      borderRadius: "40px",
                      backgroundColor: "#E0C271",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <span
                      style={{
                        fontFamily: "'SF Pro Text', system-ui, sans-serif",
                        fontWeight: 600,
                        fontSize: "40px",
                        color: "#272727",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Procurar profissionais
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── SEÇÃO 2 — Como funciona ─── */}
            <section
              style={{
                width: "100%",
                height: "100vh",
                backgroundColor: "#FAF9F5",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 600,
                  fontSize: "90px",
                  color: "#E0C271",
                  marginTop: "40px",
                  marginLeft: "40px",
                  lineHeight: 1.0,
                  marginBottom: 0,
                }}
              >
                Como funciona
              </h2>

              <h3
                style={{
                  fontFamily: "'SF Pro Display', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "50px",
                  color: "#272727",
                  marginTop: "15px",
                  marginLeft: "40px",
                  lineHeight: 1.1,
                  marginBottom: 0,
                }}
              >
                Simples para os dois lados da relação
              </h3>

              <p
                style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "30px",
                  color: "#535353",
                  marginTop: "20px",
                  marginLeft: "40px",
                  lineHeight: 1.3,
                  maxWidth: "900px",
                  marginBottom: 0,
                }}
              >
                Uma conta, dois modos de uso. Alterne entre contratar e trabalhar quando quiser.
              </p>

              {/* ── CARDS GLASS ── */}
              <div
                style={{
                  display: "flex",
                  gap: "90px",
                  marginTop: "25px",
                  marginLeft: "40px",
                }}
              >
                {/* ── CARD CONTRATANTE ── */}
                <div
                  style={{
                    width: "860px",
                    height: "640px",
                    borderRadius: "40px",
                    backgroundColor: "rgba(39, 39, 39, 0.82)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    border: "4px solid #C3A85E",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
                    paddingBottom: "32px",
                    flexShrink: 0,
                  }}
                >
                  {/* Título do card */}
                  <p style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "40px",
                    color: "#FAF9F5",
                    marginTop: "15px",
                    marginLeft: "35px",
                    marginBottom: 0,
                  }}>
                    Contratante
                  </p>

                  {/* ── PASSOS com linha vertical ── */}
                  <div style={{ position: "relative", marginTop: "20px", marginLeft: "35px" }}>

                    <div style={{
                      position: "absolute",
                      left: "18px",
                      top: "0px",
                      width: "4px",
                      height: "calc(100% - 90px)",
                      backgroundColor: "#C3A85E",
                      zIndex: 0,
                    }} />

                    {/* Passo 1 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>1</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Descreva o que precisa</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>Crie uma demanda inteligente com suas preferências.</p>
                      </div>
                    </div>

                    {/* Passo 2 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>2</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Receba sugestões filtradas</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>O sistema retorna profissionais por match, sem leilão público.</p>
                      </div>
                    </div>

                    {/* Passo 3 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>3</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Converse e negocie</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>Toda comunicação dentro da plataforma, preços e prazos com segurança.</p>
                      </div>
                    </div>

                    {/* Passo 4 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>4</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Pague com segurança</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>O valor fica retido e só é liberado com a confirmação do serviço.</p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ── CARD PRESTADOR ── */}
                <div
                  style={{
                    width: "860px",
                    height: "640px",
                    borderRadius: "40px",
                    backgroundColor: "rgba(39, 39, 39, 0.82)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    border: "4px solid #C3A85E",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
                    paddingBottom: "32px",
                    flexShrink: 0,
                  }}
                >
                  {/* Título do card */}
                  <p style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "40px",
                    color: "#FAF9F5",
                    marginTop: "15px",
                    marginLeft: "35px",
                    marginBottom: 0,
                  }}>
                    Prestador
                  </p>

                  {/* ── PASSOS com linha vertical ── */}
                  <div style={{ position: "relative", marginTop: "20px", marginLeft: "35px" }}>

                    <div style={{
                      position: "absolute",
                      left: "18px",
                      top: "0px",
                      width: "4px",
                      height: "calc(100% - 90px)",
                      backgroundColor: "#C3A85E",
                      zIndex: 0,
                    }} />

                    {/* Passo 1 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>1</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Monte seu perfil e portifólio</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>Adicione especialidades, projetos anteriores, configure sua região e disponibilidade.</p>
                      </div>
                    </div>

                    {/* Passo 2 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>2</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Receba propostas personalizadas</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>Clientes chegam até você pelo match inteligente.</p>
                      </div>
                    </div>

                    {/* Passo 3 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>3</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Execute e envie o vídeo</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>Grave um vídeo do serviço concluído para validação e garanta segurança.</p>
                      </div>
                    </div>

                    {/* Passo 4 */}
                    <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px", gap: "25px", position: "relative", zIndex: 1 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#E0C271", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5" }}>4</span>
                      </div>
                      <div>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 500, fontSize: "30px", color: "#FAF9F5", margin: 0 }}>Receba e construa reputação</p>
                        <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 300, fontSize: "25px", color: "#FAF9F5", margin: 0, marginTop: "10px", maxWidth: "720px", lineHeight: 1.35 }}>Pagamento liberado, avaliação recíproca e boa reputação que atrai clientes.</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* ─── SEÇÃO 3 — Recursos ─── */}
            <section
              style={{
                width: "100%",
                height: "100vh",
                backgroundColor: "#FAF9F5",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 600,
                  fontSize: "90px",
                  color: "#E0C271",
                  marginTop: "40px",
                  marginLeft: "40px",
                  lineHeight: 1.0,
                  marginBottom: 0,
                }}
              >
                Recursos
              </h2>

              <h3
                style={{
                  fontFamily: "'SF Pro Display', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "50px",
                  color: "#272727",
                  marginTop: "15px",
                  marginLeft: "40px",
                  lineHeight: 1.1,
                  marginBottom: 0,
                }}
              >
                Tudo o que você precisa em um só lugar
              </h3>

              <p
                style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "30px",
                  color: "#535353",
                  marginTop: "20px",
                  marginLeft: "40px",
                  lineHeight: 1.3,
                  maxWidth: "900px",
                  marginBottom: "25px",
                }}
              >
                Uma variedade de profissionais e clientes na mesma plataforma.
              </p>

              {/* ── GLASS CARD PRINCIPAL ── */}
              <div
                style={{
                  width: "1810px",
                  height: "570px",
                  borderRadius: "40px",
                  backgroundColor: "rgba(39, 39, 39, 0.82)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  border: "4px solid #C3A85E",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
                  marginLeft: "40px",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* ── LINHAS DIVISÓRIAS ── */}

                {/* Linha vertical 1 (após coluna 1) */}
                <div style={{
                  position: "absolute",
                  left: "calc(100% / 3)",
                  top: 0,
                  width: "2px",
                  height: "100%",
                  backgroundColor: "#C3A85E",
                  zIndex: 1,
                }} />

                {/* Linha vertical 2 (após coluna 2) */}
                <div style={{
                  position: "absolute",
                  left: "calc(100% / 3 * 2)",
                  top: 0,
                  width: "2px",
                  height: "100%",
                  backgroundColor: "#C3A85E",
                  zIndex: 1,
                }} />

                {/* Linha horizontal (entre linha 1 e 2) */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  width: "100%",
                  height: "2px",
                  backgroundColor: "#C3A85E",
                  zIndex: 1,
                }} />

                {/* ── GRID DE SUBDIVISÕES ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(2, 1fr)",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {[
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
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        padding: "0",
                      }}
                    >
                      {/* Caixa ícone */}
                      <div
                        style={{
                          marginTop: "30px",
                          marginLeft: "30px",
                          width: "50px",
                          height: "50px",
                          borderRadius: "10px",
                          backgroundColor: "#E0C271",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Image
                          src={`/images/${item.icon}`}
                          alt={item.title}
                          width={item.iconSize}
                          height={item.iconSize}
                        />
                      </div>

                      {/* Título */}
                      <p
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontWeight: 500,
                          fontSize: "30px",
                          color: "#FAF9F5",
                          margin: 0,
                          marginTop: "15px",
                          marginLeft: "30px",
                        }}
                      >
                        {item.title}
                      </p>

                      {/* Descrição */}
                      <p
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontWeight: 400,
                          fontSize: "25px",
                          color: "#FAF9F5",
                          margin: 0,
                          marginTop: "10px",
                          marginLeft: "30px",
                          marginRight: "30px",
                          lineHeight: 1.35,
                          textAlign: "justify",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ─── SEÇÃO 4 — Avaliações ─── */}
            <section
              style={{
                width: "100%",
                height: "100vh",
                backgroundColor: "#FAF9F5",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 600,
                  fontSize: "90px",
                  color: "#E0C271",
                  marginTop: "40px",
                  marginLeft: "40px",
                  lineHeight: 1.0,
                  marginBottom: 0,
                }}
              >
                Avaliações
              </h2>

              <h3
                style={{
                  fontFamily: "'SF Pro Display', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "50px",
                  color: "#272727",
                  marginTop: "15px",
                  marginLeft: "40px",
                  lineHeight: 1.1,
                  marginBottom: 0,
                }}
              >
                Quem já usa, aprova
              </h3>

              <p
                style={{
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "30px",
                  color: "#535353",
                  marginTop: "20px",
                  marginLeft: "40px",
                  lineHeight: 1.3,
                  maxWidth: "900px",
                  marginBottom: "30px",
                }}
              >
                Uma conta, dois modos de uso. Alterne entre contratar e trabalhar quando quiser.
              </p>

              {/* ── CARROSSEL DE REVIEWS ── */}
              {(() => {
                const rowTop = [
                  { stars: 5, quote: "Encontrei um eletricista excelente em menos de 2 horas. O match foi perfeito e o pagamento super seguro. Recomendo demais!", name: "Matheus S.", role: "Eletricista • São Paulo, SP" },
                  { stars: 5, quote: "Como prestadora, recebi propostas alinhadas com meu perfil desde o primeiro dia. A plataforma entende o que você oferece.", name: "Carla M.", role: "Pintora • Rio de Janeiro, RJ" },
                  { stars: 4, quote: "O sistema de vídeo de validação me deu muita segurança. Sabia exatamente o que estava contratando antes de liberar o pagamento.", name: "Ricardo T.", role: "Contratante • Curitiba, PR" },
                  { stars: 5, quote: "Nunca foi tão fácil fechar serviços. O chat integrado e o histórico de negociações deixam tudo muito mais organizado.", name: "Ana P.", role: "Designer de Interiores • Contagem, MG" },
                  { stars: 5, quote: "Minha reputação cresceu rápido com as avaliações recíprocas. Os clientes chegam até mim, não preciso mais correr atrás.", name: "João V.", role: "Encanador • Porto Alegre, RS" },
                  { stars: 4, quote: "Alternei entre contratar e trabalhar na mesma semana. Flexibilidade total com uma conta só. Isso faz toda a diferença.", name: "Fernanda L.", role: "Contratante • Brasília, DF" },
                ];
                const rowBottom = [
                  { stars: 5, quote: "Uma plataforma que não transforma trabalho em leilão. Os clientes chegam até mim pelo portfólio, não pelo menor preço.", name: "Lucas S.", role: "Marceneiro • São Paulo, SP" },
                  { stars: 5, quote: "Tenho conseguido muito mais trabalho graças à plataforma, muito boa!", name: "Miguel A.", role: "Pintor • Manaus, AM" },
                  { stars: 5, quote: "Melhor site para fazer reformas, muito prático.", name: "Jorge L.", role: "Contratante • Campinas, SP" },
                  { stars: 5, quote: "Finalmente encontrei uma forma de mostrar meu trabalho de verdade. Os clientes chegam qualificados e sabem o que querem.", name: "Mariana C.", role: "Arquiteta • Florianópolis, SC" },
                  { stars: 4, quote: "A validação por vídeo me deu coragem de contratar alguém pela primeira vez online. Tudo foi transparente do início ao fim.", name: "Roberto F.", role: "Contratante • Recife, PE" },
                  { stars: 5, quote: "Em duas semanas já tinha avaliações positivas e novos clientes batendo na porta. O sistema de reputação é muito bem pensado.", name: "Tatiane B.", role: "Diarista • Belo Horizonte, MG" },
                ];

                const ReviewCard = ({ review, idx }: { review: typeof rowTop[0]; idx: number }) => (
                  <div key={idx} style={{ width: "590px", height: "300px", borderRadius: "40px", backgroundColor: "rgba(39, 39, 39, 0.82)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: "4px solid #C3A85E", boxShadow: "0 8px 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", paddingLeft: "30px", paddingRight: "30px", boxSizing: "border-box", flexShrink: 0 }}>
                    <div style={{ display: "flex", gap: "10px", marginTop: "30px", marginBottom: "10px" }}>
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Image key={s} src="/images/review.svg" alt="estrela" width={25} height={25} style={{ opacity: s < review.stars ? 1 : 0.25 }} />
                      ))}
                    </div>
                    <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#FAF9F5", margin: 0, maxWidth: "550px", lineHeight: 1.35, textAlign: "justify", flex: 1 }}>{review.quote}</p>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", marginTop: "auto" }}>
                      <Image src="/images/profile.svg" alt={review.name} width={50} height={50} style={{ marginRight: "10px", flexShrink: 0 }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "25px", color: "#FAF9F5", lineHeight: 1.1 }}>{review.name}</span>
                        <span style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "20px", color: "#C3A85E", lineHeight: 1.1 }}>{review.role}</span>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    {/* Faixa 1: esquerda → direita */}
                    <div className="carousel-viewport" style={{ width: "100%" }}>
                      <div className="carousel-track-ltr">
                        {[...rowTop, ...rowTop, ...rowTop].map((r, i) => <ReviewCard key={i} review={r} idx={i} />)}
                      </div>
                    </div>
                    {/* Faixa 2: direita → esquerda */}
                    <div className="carousel-viewport" style={{ width: "100%" }}>
                      <div className="carousel-track-rtl">
                        {[...rowBottom, ...rowBottom, ...rowBottom].map((r, i) => <ReviewCard key={i} review={r} idx={i} />)}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── MÁSCARAS LATERAIS ── */}
              <div style={{
                position: "absolute",
                top: /* alinhe com o topo dos cards, ex: */ "310px",
                left: 0,
                width: "40px",
                height: "700px",
                backgroundColor: "#FAF9F5",
                zIndex: 40,
                pointerEvents: "none",
              }} />

              <div style={{
                position: "absolute",
                top: "310px",
                right: 0,
                width: "70px",
                height: "700px",
                backgroundColor: "#FAF9F5",
                zIndex: 40,
                pointerEvents: "none",
              }} />
            </section>

            {/* ─── SEÇÃO 5 — Rodapé ─── */}

            <section
              style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#FAF9F5",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                paddingBottom: 0,
                margin: 0,
              }}
            >
              {/* Card CTA */}
              <div
                style={{
                  width: "1200px",
                  height: "570px",
                  borderRadius: "40px",
                  backgroundColor: "rgba(39, 39, 39, 0.82)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.28)",
                  border: "4px solid #C3A85E",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  margin: "auto 0",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {/* Título */}
                <h2
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "60px",
                    color: "#E0C271",
                    marginTop: "-10px",
                    marginBottom: "30px",
                    textAlign: "center",
                  }}
                >
                  Pronto para começar?
                </h2>

                {/* Subtítulo com DOMI em Bold */}
                <p
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "40px",
                    color: "#FAF9F5",
                    marginLeft: "10px",
                    marginBottom: "60px",
                    maxWidth: "660px",
                    textAlign: "justify",
                  }}
                >
                  Cadastre-se gratuitamente e escolha como quer usar a{" "}
                  <span
                    style={{
                      fontWeight: 700,
                      fontFamily: "'Clash Display', sans-serif",
                    }}
                  >
                    DOMI
                  </span>
                  .
                </p>

                {/* Botões */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "40px",
                    alignItems: "center",
                  }}
                >
                  {/* Botão Criar conta grátis */}
                  <a
                    href="/register"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "390px",
                      height: "75px",
                      borderRadius: "80px",
                      backgroundColor: "#E0C271",
                      textDecoration: "none",
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 500,
                      fontSize: "40px",
                      color: "#FAF9F5",
                      flexShrink: 0,
                      border: "none",
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Criar conta grátis
                  </a>

                  {/* Botão Já tenho uma conta */}
                  <a
                    href="/login"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "260px",
                      height: "60px",
                      borderRadius: "50px",
                      backgroundColor: "transparent",
                      border: "2px solid #FAF9F5",
                      textDecoration: "none",
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 300,
                      fontSize: "30px",
                      color: "#FAF9F5",
                      flexShrink: 0,
                      cursor: "pointer",
                      transition: "transform 0.2s ease, background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.07)";
                      e.currentTarget.style.backgroundColor = "rgba(250, 249, 245, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Já tenho conta
                  </a>
                </div>
              </div>

              {/* Footer */}
              <footer
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#E0C271",
                  color: "#1A1A1A",
                  borderTopLeftRadius: "60px",
                  borderTopRightRadius: "60px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: "1920px",
                    margin: "0 auto",
                  }}
                >
                  {/* Container Principal - Grade */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(12, 1fr)",
                      gap: "40px",
                      marginBottom: "30px",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Coluna 1: Logo e Descrição */}
                    <div style={{ gridColumn: "span 4" }}>
                      <h2
                        style={{
                          fontFamily: "'Clash Display', sans-serif",
                          fontSize: "70px",
                          fontWeight: 700,
                          margin: 0,
                          marginTop: "0px",
                          marginBottom: "15px",
                          marginLeft: "100px",
                          color: "#272727",
                        }}
                      >
                        DOMI
                      </h2>
                      <p
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontSize: "20px",
                          fontWeight: 500,
                          color: "#272727",
                          maxWidth: "380px",
                          marginLeft: "100px",
                          lineHeight: 1.5,
                          textAlign: "justify",
                        }}
                      >
                        Encontre profissionais de confiança ou ofereça seus
                        serviços, tudo em um só lugar com qualidade e segurança.
                      </p>
                    </div>

                    {/* Coluna 2: Redes Sociais */}
                    <div
                      style={{
                        gridColumn: "span 2",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        transform: "translateX(-140px)",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: "20px",
                          textTransform: "uppercase",
                          marginTop: "20px",
                          color: "#272727",
                        }}
                      >
                        Redes Sociais
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "30px",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "45px",
                        }}
                      >
                        {[
                          {
                            name: "Instagram",
                            src: "/images/Instagram.svg",
                            width: 65,
                            height: 65,
                          },
                          {
                            name: "YouTube",
                            src: "/images/Youtube.svg",
                            width: 92,
                            height: 65,
                          },
                          {
                            name: "Twitter",
                            src: "/images/Twitter.svg",
                            width: 72,
                            height: 65,
                          },
                          {
                            name: "TikTok",
                            src: "/images/TikTok.svg",
                            width: 58,
                            height: 65,
                          },
                        ].map((social) => (
                          <a
                            key={social.name}
                            href="#"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              textDecoration: "none",
                              opacity: 1,
                              transition: "opacity 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "0.7";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                          >
                            <Image
                              src={social.src}
                              alt={social.name}
                              width={social.width}
                              height={social.height}
                              style={{ display: "block" }}
                            />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Coluna 3: Produto */}
                    <div style={{ gridColumn: "span 2" }}>
                      <h3
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: "20px",
                          marginBottom: "20px",
                          textTransform: "uppercase",
                          marginTop: "20px",
                          color: "#272727",
                        }}
                      >
                        Produto
                      </h3>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {[
                          { label: "Como funciona", idx: 1 },
                          { label: "Recursos", idx: 2 },
                          { label: "Avaliações", idx: 3 },
                          { label: "Cadastrar-se", href: "/register" },
                        ].map((item) => (
                          <li key={item.label}>
                            {item.idx !== undefined ? (
                              <button
                                onClick={() => goTo(item.idx)}
                                style={{
                                  fontFamily:
                                    "'SF Pro Text', system-ui, sans-serif",
                                  fontSize: "18px",
                                  fontWeight: 300,
                                  color: "#272727",
                                  textDecoration: "none",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                  transition: "text-decoration 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.textDecoration =
                                    "underline";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.textDecoration = "none";
                                }}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <a
                                href={item.href}
                                style={{
                                  fontFamily:
                                    "'SF Pro Text', system-ui, sans-serif",
                                  fontSize: "18px",
                                  fontWeight: 300,
                                  color: "#272727",
                                  textDecoration: "none",
                                  transition: "text-decoration 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.textDecoration =
                                    "underline";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.textDecoration = "none";
                                }}
                              >
                                {item.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Coluna 4: Empresa */}
                    <div style={{ gridColumn: "span 2" }}>
                      <h3
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: "20px",
                          marginBottom: "20px",
                          textTransform: "uppercase",
                          marginTop: "20px",
                          color: "#272727",
                        }}
                      >
                        Empresa
                      </h3>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {["Sobre nós", "Carreiras", "Blog", "Imprensa"].map(
                          (item) => (
                            <li key={item}>
                              <a
                                href="#"
                                style={{
                                  fontFamily:
                                    "'SF Pro Text', system-ui, sans-serif",
                                  fontSize: "18px",
                                  fontWeight: 300,
                                  color: "#272727",
                                  textDecoration: "none",
                                  transition: "text-decoration 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.textDecoration =
                                    "underline";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.textDecoration = "none";
                                }}
                              >
                                {item}
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    {/* Coluna 5: Suporte */}
                    <div style={{ gridColumn: "span 2" }}>
                      <h3
                        style={{
                          fontFamily: "'SF Pro Text', system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: "20px",
                          marginBottom: "20px",
                          textTransform: "uppercase",
                          marginTop: "20px",
                          color: "#272727",
                        }}
                      >
                        Suporte
                      </h3>
                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        {[
                          "Central de ajuda",
                          "Termos de uso",
                          "Privacidade",
                          "Contato",
                        ].map((item) => (
                          <li key={item}>
                            <a
                              href="#"
                              style={{
                                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                                fontSize: "18px",
                                fontWeight: 300,
                                color: "#272727",
                                textDecoration: "none",
                                transition: "text-decoration 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.textDecoration = "underline";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.textDecoration = "none";
                              }}
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Linha Divisória e Copyright */}
                  <div
                    style={{
                      borderTop: "2px solid #C3A85E",
                      marginBottom: "10px",
                      marginLeft: "40px",
                      maxWidth: "1840px",
                      position: "relative",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'SF Pro Text', system-ui, sans-serif",
                        fontSize: "18px",
                        fontWeight: 500,
                        color: "#272727",
                        marginTop: "5px",
                        marginLeft: "55px",
                        position: "absolute",
                      }}
                    >
                      © {new Date().getFullYear()} DOMI. Todos os direitos reservados.
                    </p>
                  </div>
                </div>
              </footer>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}