"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("contratante");
  const [visibleTab, setVisibleTab] = useState("contratante");
  const [tabVisible, setTabVisible] = useState(true);

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    // 1. Fade out
    setTabVisible(false);
    // 2. Após a transição, troca o conteúdo e faz fade in
    setTimeout(() => {
      setActiveTab(tab);
      setVisibleTab(tab);
      setTabVisible(true);
    }, 300);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#FAF9F5",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
    >
      {/* ── ESTILOS DE TRANSIÇÃO DE TAB ── */}
      <style>{`
        .tab-content {
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.85s ease, transform 0.85s ease;
        }
        .tab-content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .menu-panel {
          position: absolute;
          top: 90px;
          right: 0px;
          width: 520px;
          height: calc(100vh - 90px);
          border-radius: 40px 0 0 40px;
          background-color: rgba(39, 39, 39, 0.82);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.28);
          z-index: 99;
          overflow: hidden;
          flex-shrink: 0;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .menu-panel.open {
          transform: translateX(0);
        }
      `}</style>

      {/* ── CABEÇALHO ── */}
      <header
        style={{
          width: "100%",
          height: "90px",
          backgroundColor: "#E0C271",
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
          marginBottom: "35px",
        }}
      >
        {/* Logo imagem */}
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

        {/* Texto DOMI */}
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

        {/* ── SWITCH Contratante / Profissional ── */}
        <div
          style={{
            width: "410px",
            height: "55px",
            borderRadius: "70px",
            backgroundColor: "#C3A85E",
            display: "flex",
            alignItems: "center",
            position: "relative",
            marginLeft: "850px",
            cursor: "pointer",
            flexShrink: 0,
            padding: "5px",
            boxSizing: "border-box",
          }}
        >
          {/* Pill animada */}
          <div
            style={{
              position: "absolute",
              top: "5px",
              left: activeTab === "contratante" ? "5px" : "calc(50% + 0px)",
              width: "200px",
              height: "45px",
              borderRadius: "60px",
              backgroundColor: "#E0C271",
              transition: "left 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)",
              zIndex: 0,
            }}
          />

          {/* Botão Contratante */}
          <button
            onClick={() => handleTabChange("contratante")}
            style={{
              flex: 1,
              height: "100%",
              background: "none",
              border: "none",
              borderRadius: "60px",
              cursor: "pointer",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "30px",
              color: activeTab === "contratante" ? "#FAF9F5" : "#272727",
              position: "relative",
              zIndex: 1,
              transition: "color 0.3s ease",
            }}
          >
            Contratante
          </button>

          {/* Botão Profissional */}
          <button
            onClick={() => handleTabChange("profissional")}
            style={{
              flex: 1,
              height: "100%",
              background: "none",
              border: "none",
              borderRadius: "60px",
              cursor: "pointer",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "30px",
              color: activeTab === "profissional" ? "#FAF9F5" : "#272727",
              position: "relative",
              zIndex: 1,
              transition: "color 0.3s ease",
            }}
          >
            Profissional
          </button>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* profile_notify.svg */}
        <Image
          src="/images/profile_notify.svg"
          alt="Perfil"
          width={52}
          height={53}
          onClick={() => router.push("/profile")}
          style={{ display: "block", marginLeft: "0px", cursor: "pointer" }}
        />

        {/* navy.svg — abre/fecha menu */}
        <Image
          src="/images/navy.svg"
          alt="Menu"
          width={60}
          height={50}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "block",
            marginLeft: "60px",
            marginRight: "80px",
            cursor: "pointer",
          }}
        />
      </header>

      {/* ── GLASS MENU PANEL ── */}
      {/* Overlay para fechar ao clicar fora — só ativo quando aberto */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 98,
          }}
        />
      )}

      {/* Painel — sempre no DOM, entra/sai via translateX */}
      <div className={`menu-panel${menuOpen ? " open" : ""}`}>
            {/* Olá <usuário>! */}
            <p
              style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: "50px",
                color: "#FAF9F5",
                margin: 0,
                marginTop: "60px",
                marginLeft: "40px",
                lineHeight: 1.1,
              }}
            >
              Olá, Usuário!
            </p>

            {/* ── Linhas divisórias + itens ── */}
            {/* As 6 linhas dividem a área abaixo do título em 5 células de 90px cada.
                Linha 1: 20px abaixo do texto
                Linhas 2–6: cada 90px depois da anterior.
                Itens ficam verticalmente centralizados no intervalo entre linhas. */}

            {(() => {
              const lineColor = "#FAF9F5";
              const lineStyle: React.CSSProperties = {
                position: "absolute",
                left: "0px",
                width: "520px",
                height: "2px",
                backgroundColor: lineColor,
              };

              // Estimativa do topo do texto "Olá": marginTop 60px, fontSize ~55px (com lineHeight)
              const textBottom = 60 + 55 + 10; // ≈ 125px do topo do painel
              const firstLineTop = textBottom + 20; // 20px abaixo do texto ≈ 145px
              const rowHeight = 90;

              const menuItems = [
                { icon: "message.svg",  iconW: 42, iconH: 40, label: "Mensagens",    hasSwitch: false, href: "/messages" },
                { icon: "settings.svg", iconW: 40, iconH: 40, label: "Configurações", hasSwitch: false, href: null },
                { icon: "mode.svg",     iconW: 40, iconH: 40, label: "Modo escuro",   hasSwitch: true,  href: null },
                { icon: "help.svg",     iconW: 40, iconH: 40, label: "Ajuda",         hasSwitch: false, href: null },
                { icon: "logout.svg",   iconW: 40, iconH: 40, label: "Sair da conta", hasSwitch: false, href: null },
              ];

              return (
                <>
                  {/* 6 linhas */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={`line-${i}`}
                      style={{ ...lineStyle, top: `${firstLineTop + i * rowHeight}px` }}
                    />
                  ))}

                  {/* 5 itens — centralizados verticalmente entre cada par de linhas */}
                  {menuItems.map((item, i) => {
                    const rowTop = firstLineTop + i * rowHeight;
                    const centerY = rowTop + rowHeight / 2; // centro do intervalo
                    return (
                      <div
                        key={item.label}
                        onClick={() => { if (item.href) router.push(item.href); }}
                        style={{
                          position: "absolute",
                          top: `${centerY}px`,
                          transform: "translateY(-50%)",
                          left: "40px",
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          cursor: item.hasSwitch ? "default" : "pointer",
                        }}
                      >
                        {/* Ícone */}
                        <Image
                          src={`/images/${item.icon}`}
                          alt={item.label}
                          width={item.iconW}
                          height={item.iconH}
                          style={{ flexShrink: 0 }}
                        />

                        {/* Label com underline on hover */}
                        <span
                          style={{
                            fontFamily: "'SF Pro Text', system-ui, sans-serif",
                            fontWeight: 500,
                            fontSize: "40px",
                            color: "#FAF9F5",
                            userSelect: "none",
                            transition: "text-decoration 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            if (!item.hasSwitch) e.currentTarget.style.textDecoration = "underline";
                          }}
                          onMouseLeave={(e) => {
                            if (!item.hasSwitch) e.currentTarget.style.textDecoration = "none";
                          }}
                        >
                          {item.label}
                        </span>

                        {/* Switch para "Modo escuro" */}
                        {item.hasSwitch && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setDarkMode((v) => !v);
                            }}
                            style={{
                              marginLeft: "60px",
                              width: "80px",
                              height: "40px",
                              borderRadius: "20px",
                              backgroundColor: darkMode ? "#E0C271" : "#C3C3C3",
                              position: "relative",
                              cursor: "pointer",
                              flexShrink: 0,
                              transition: "background-color 0.3s ease",
                            }}
                          >
                            {/* Círculo do switch */}
                            <div
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: darkMode ? "calc(100% - 37px)" : "4px",
                                transform: "translateY(-50%)",
                                width: "33px",
                                height: "33px",
                                borderRadius: "50%",
                                backgroundColor: "#FAF9F5",
                                transition: "left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>

      {/* ── BARRA DE PESQUISA ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "1710px",
          height: "80px",
          backgroundColor: "#EAEAEA",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.25)",
          borderRadius: "60px",
          marginLeft: "105px",
          marginBottom: "0px",
          paddingLeft: "50px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/lupa.svg"
          alt="Buscar"
          width={50}
          height={50}
          style={{ flexShrink: 0 }}
        />
        <input
          type="text"
          placeholder="Que serviço você precisa hoje?"
          style={{
            flex: 1,
            marginLeft: "30px",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "40px",
            color: "#535353",
          }}
        />
      </div>

      {/* ── WRAPPER ANIMADO DAS SEÇÕES ── */}
      <div className={`tab-content${tabVisible ? " visible" : ""}`}>

      {/* ════ SEÇÃO CONTRATANTE ════ */}
      {activeTab === "contratante" && (
        <div style={{ paddingLeft: "55px", paddingRight: "55px" }}>

          {/* Box 1 — Criar demanda inteligente */}
          <div
            style={{
              width: "1810px", height: "340px", borderRadius: "80px", backgroundColor: "#E0C271",
              marginTop: "45px", marginBottom: "30px", position: "relative", display: "flex",
              flexDirection: "column", flexShrink: 0, overflow: "hidden", cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.005)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Imagem + Título na mesma linha */}
            <div style={{ display: "flex", alignItems: "center", marginTop: "45px", marginLeft: "60px", gap: "15px" }}>
              <Image src="/images/ticket.svg" alt="Criar demanda" width={75} height={75} style={{ flexShrink: 0 }} />
              <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", margin: 0, lineHeight: 1.0 }}>
                Criar demanda inteligente
              </p>
            </div>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px",
              color: "#272727", margin: 0, marginTop: "30px", marginLeft: "60px",
              maxWidth: "1600px", lineHeight: 1.3, textAlign: "justify",
            }}>
              Crie sua demanda inteligente com suas necessidades, localização e disponibilidade que a DOMI te ajuda a encontrar o profissional ideal!
            </p>
            <div style={{ position: "absolute", top: "30px", right: "50px" }}>
              <Image src="/images/expand.svg" alt="Expandir" width={50} height={50} />
            </div>
          </div>

          {/* Row: Box 2 + Box 3 */}
          <div style={{ display: "flex", gap: "30px" }}>

            {/* Box 2 — Meus contratos */}
            <div
              style={{
                width: "890px", height: "340px", borderRadius: "80px", backgroundColor: "#E0C271",
                position: "relative", flexShrink: 0, overflow: "hidden", cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.008)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ display: "flex", alignItems: "center", marginTop: "45px", marginLeft: "60px", gap: "15px" }}>
                <Image src="/images/deal.svg" alt="Contratos" width={125} height={75} style={{ flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", margin: 0, lineHeight: 1.0 }}>
                  Meus contratos
                </p>
              </div>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px",
                color: "#272727", margin: 0, marginTop: "30px", marginLeft: "60px",
                maxWidth: "780px", lineHeight: 1.3, textAlign: "justify",
              }}>
                Navegue pelos seus contratos antigos
              </p>
              <div style={{ position: "absolute", top: "265px", right: "50px" }}>
                <Image src="/images/expand.svg" alt="Expandir" width={50} height={50} />
              </div>
            </div>

            {/* Box 3 — Explorar catálogo */}
            <div
              style={{
                width: "890px", height: "340px", borderRadius: "80px", backgroundColor: "#E0C271",
                position: "relative", flexShrink: 0, overflow: "hidden", cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.008)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ display: "flex", alignItems: "center", marginTop: "45px", marginLeft: "60px", gap: "15px" }}>
                <Image src="/images/explore.svg" alt="Explorar" width={75} height={75} style={{ flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", margin: 0, lineHeight: 1.0 }}>
                  Explorar catálogo
                </p>
              </div>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px",
                color: "#272727", margin: 0, marginTop: "30px", marginLeft: "60px",
                maxWidth: "780px", lineHeight: 1.3, textAlign: "justify",
              }}>
                Conheça os profissionais da plataforma explorando os perfis deles no catálogo.
              </p>
              <div style={{ position: "absolute", top: "265px", right: "50px" }}>
                <Image src="/images/expand.svg" alt="Expandir" width={50} height={50} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ SEÇÃO PROFISSIONAL ════ */}
      {activeTab === "profissional" && (
        <div style={{ paddingLeft: "55px", paddingRight: "55px" }}>

          {/* Box 1 — Portifólio */}
          <div
            style={{
              width: "1810px", height: "340px", borderRadius: "80px", backgroundColor: "#E0C271",
              marginTop: "45px", marginBottom: "30px", position: "relative", display: "flex",
              flexDirection: "column", flexShrink: 0, overflow: "hidden", cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.005)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ display: "flex", alignItems: "center", marginTop: "45px", marginLeft: "60px", gap: "15px" }}>
              <Image src="/images/portifolio.svg" alt="Portifólio" width={112} height={75} style={{ flexShrink: 0 }} />
              <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", margin: 0, lineHeight: 1.0 }}>
                Portifólio
              </p>
            </div>
            <p style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px",
              color: "#272727", margin: 0, marginTop: "30px", marginLeft: "60px",
              maxWidth: "1600px", lineHeight: 1.3, textAlign: "justify",
            }}>
              Mantenha seu portifólio atualizado com seus trabalhos, localização e disponibilidade que a DOMI te ajuda a encontrar trabalhos ideais!
            </p>
            <div style={{ position: "absolute", top: "30px", right: "50px" }}>
              <Image src="/images/expand.svg" alt="Expandir" width={50} height={50} />
            </div>
          </div>

          {/* Row: Box 2 + Box 3 */}
          <div style={{ display: "flex", gap: "30px" }}>

            {/* Box 2 — Meus contratos */}
            <div
              style={{
                width: "890px", height: "340px", borderRadius: "80px", backgroundColor: "#E0C271",
                position: "relative", flexShrink: 0, overflow: "hidden", cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.008)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ display: "flex", alignItems: "center", marginTop: "45px", marginLeft: "60px", gap: "15px" }}>
                <Image src="/images/deal.svg" alt="Contratos" width={125} height={75} style={{ flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", margin: 0, lineHeight: 1.0 }}>
                  Meus contratos
                </p>
              </div>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px",
                color: "#272727", margin: 0, marginTop: "30px", marginLeft: "60px",
                maxWidth: "780px", lineHeight: 1.3, textAlign: "justify",
              }}>
                Navegue pelos seus contratos antigos
              </p>
              <div style={{ position: "absolute", top: "265px", right: "50px" }}>
                <Image src="/images/expand.svg" alt="Expandir" width={50} height={50} />
              </div>
            </div>

            {/* Box 3 — Financeiro */}
            <div
              style={{
                width: "890px", height: "340px", borderRadius: "80px", backgroundColor: "#E0C271",
                position: "relative", flexShrink: 0, overflow: "hidden", cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.008)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ display: "flex", alignItems: "center", marginTop: "45px", marginLeft: "60px", gap: "15px" }}>
                <Image src="/images/wallet.svg" alt="Financeiro" width={77} height={75} style={{ flexShrink: 0 }} />
                <p style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 700, fontSize: "70px", color: "#272727", margin: 0, lineHeight: 1.0 }}>
                  Financeiro
                </p>
              </div>
              <p style={{
                fontFamily: "'SF Pro Text', system-ui, sans-serif", fontWeight: 400, fontSize: "40px",
                color: "#272727", margin: 0, marginTop: "30px", marginLeft: "60px",
                maxWidth: "780px", lineHeight: 1.3, textAlign: "justify",
              }}>
                Fique de olho em seus ganhos com a plataforma.
              </p>
              <div style={{ position: "absolute", top: "265px", right: "50px" }}>
                <Image src="/images/expand.svg" alt="Expandir" width={50} height={50} />
              </div>
            </div>
          </div>
        </div>
      )}

      </div>{/* fim tab-content */}
    </div>
  );
}