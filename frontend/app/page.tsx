"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function Home() {
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
                src="/images/logo_domi.png"
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
                  }}
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
                }}
              >
                Entrar
              </a>

              <a
                href="/cadastro"
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
                }}
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
              src="/images/phone.png"
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
                backgroundColor: "#EFEFEF",
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
                }}
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
                border: "1px solid rgba(255, 255, 255, 0.08)",
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
                border: "1px solid rgba(255, 255, 255, 0.08)",
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
            }}
          >
            Uma variedade de profissionais e clientes na mesma plataforma.
          </p>
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
            }}
          >
            Uma conta, dois modos de uso. Alterne entre contratar e trabalhar quando quiser.
          </p>
        </section>

        {/* ─── SEÇÃO 5 — Rodapé ─── */}
        <section
          style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "#FAF9F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <footer style={{ textAlign: "center" }}>
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 700,
                fontSize: "70px",
                color: "#E0C271",
                letterSpacing: "-1px",
              }}
            >
              DOMI
            </span>
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "24px",
                color: "#FAF9F5",
                marginTop: "16px",
              }}
            >
              © {new Date().getFullYear()} DOMI. Todos os direitos reservados.
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}