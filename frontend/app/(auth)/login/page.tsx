"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, loading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowError(false);

    const user = await login({ email, senha: password });
    if (user) {
      router.push("/home");
      return;
    }

    setInputError(true);
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  }

  function handleForgotSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setForgotSent(true);
  }

  function closeForgot() {
    setShowForgot(false);
    setForgotSent(false);
    setForgotEmail("");
  }

  function handleResend() {
    if (resendCooldown > 0) return;
    setResendCooldown(80);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes fill-ltr {
          from { background-size: 0% 100%; }
          to   { background-size: 100% 100%; }
        }
        .btn-loading {
          background-image: linear-gradient(to right, #C3A85E 0%, #C3A85E 100%);
          background-size: 0% 100%;
          background-repeat: no-repeat;
          animation: fill-ltr 1.8s ease forwards;
        }
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .popup-card {
          animation: popup-in 0.25s ease forwards;
        }
      `}</style>

      {/* ── OVERLAY COM DESFOQUE ── */}
      {showForgot && (
        <div
          onClick={closeForgot}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(39, 39, 39, 0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(850px, 92vw)",
              minHeight: "min(560px, 90vh)",
              borderRadius: "40px",
              backgroundColor: "#FAF9F5",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(40px, 5vh, 80px) clamp(24px, 5vw, 70px)",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            <button
              onClick={closeForgot}
              style={{
                position: "absolute",
                top: "30px",
                left: "30px",
                fontSize: "20px",
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                fontWeight: 600,
                color: "#272727",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              ← Voltar
            </button>

            {!forgotSent ? (
              <>
                <Image
                  src="/images/logo_domi.svg"
                  alt="Logo DOMI"
                  width={70.5}
                  height={60}
                  style={{ marginBottom: "15px", marginTop: "-20px" }}
                />
                <h2
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.25rem, 2.6vw, 3.125rem)",
                    color: "#272727",
                    textAlign: "center",
                    margin: "0 0 20px 0",
                  }}
                >
                  Redefina sua senha
                </h2>
                <p
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
                    color: "#535353",
                    textAlign: "justify",
                    lineHeight: 1.4,
                    margin: "0 0 20px 0",
                    maxWidth: "640px",
                  }}
                >
                  Insira seu e-mail e receba as instruções para definir a nova
                  senha.
                </p>
                <form
                  onSubmit={handleForgotSubmit}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
                      fontWeight: 510,
                      color: "#272727",
                      alignSelf: "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    e-mail
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#EAEAEA",
                      borderRadius: "60px",
                      padding: "0 30px",
                      width: "100%",
                      height: "clamp(44px, 3.39vw, 65px)",
                      marginBottom: "30px",
                      border: "2px solid transparent",
                      boxSizing: "border-box",
                    }}
                  >
                    <Image
                      src="/images/email.svg"
                      alt="email"
                      width={28}
                      height={22}
                    />
                    <input
                      type="email"
                      placeholder="insira seu e-mail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        backgroundColor: "transparent",
                        outline: "none",
                        marginLeft: "15px",
                        fontWeight: 400,
                        fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
                        color: "#535353",
                      }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      display: "flex",
                      backgroundColor: "#E0C271",
                      color: "#FAF9F5",
                      border: "none",
                      borderRadius: "65px",
                      width: "clamp(140px, 13.54vw, 260px)",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "clamp(44px, 3.39vw, 65px)",
                      fontSize: "clamp(1.125rem, 2.34vw, 2.8125rem)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <>
                <Image
                  src="/images/logo_domi.svg"
                  alt="Logo DOMI"
                  width={70.5}
                  height={60}
                  style={{ marginBottom: "30px", marginTop: "-58px" }}
                />
                <h2
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.25rem, 2.6vw, 3.125rem)",
                    color: "#272727",
                    textAlign: "center",
                    margin: "0 0 40px 0",
                  }}
                >
                  E-mail enviado!
                </h2>
                <p
                  style={{
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
                    color: "#535353",
                    textAlign: "center",
                    lineHeight: 1.4,
                    margin: "0 0 50px 0",
                    maxWidth: "640px",
                  }}
                >
                  Verifique sua caixa de entrada em{" "}
                  <span style={{ color: "#272727", fontWeight: 600 }}>
                    {forgotEmail}
                  </span>{" "}
                  e siga as instruções para redefinir sua senha.
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  style={{
                    display: "flex",
                    backgroundColor: resendCooldown > 0 ? "#EAEAEA" : "#E0C271",
                    color: resendCooldown > 0 ? "#535353" : "#FAF9F5",
                    border: "none",
                    borderRadius: "65px",
                    width: "clamp(200px, 21.875vw, 420px)",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "clamp(44px, 3.65vw, 70px)",
                    fontSize: "clamp(1rem, 2.1vw, 2.5rem)",
                    fontWeight: 600,
                    cursor: resendCooldown > 0 ? "default" : "pointer",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease, width 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (resendCooldown === 0)
                      e.currentTarget.style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {resendCooldown > 0
                    ? `Reenviar em ${resendCooldown}s`
                    : "Enviar novamente"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Imagem de fundo - Topo Direita */}
      <div
        style={{
          position: "absolute",
          top: "90px",
          right: "80px",
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Image
          src="/images/logo_domi.svg"
          alt="Logo decorativa"
          width={346}
          height={295}
          priority
          style={{ transform: "scaleX(-1)" }}
        />
      </div>

      {/* Imagem de fundo - Base Esquerda */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "40px",
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Image
          src="/images/logo_domi.svg"
          alt="Logo decorativa"
          width={463.5}
          height={390.5}
        />
      </div>

      {/* Botão voltar */}
      <div
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: "clamp(20px, 2.4vw, 46px)",
          left: "clamp(20px, 2.66vw, 51px)",
          fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 500,
          color: "#272727",
          cursor: "pointer",
          userSelect: "none",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.textDecoration = "underline")
        }
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        ← Voltar
      </div>

      {/* Container Principal */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(1000px, 92vw)",
          padding: "0 clamp(16px, 3vw, 40px)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "clamp(1.75rem, 3.125vw, 3.75rem)",
            fontWeight: 900,
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "clamp(-10px, -1vw, -30px)",
            color: "#272727",
          }}
        >
          DOMI
        </h1>

        <h2
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontSize: "clamp(3rem, 6.77vw, 8.125rem)",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "0px",
            color: "#272727",
          }}
        >
          Entrar
        </h2>

        {/* Mensagem de erro */}
        <p
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.75rem, 1.04vw, 1.25rem)",
            color: "#D92B2E",
            textAlign: "center",
            opacity: showError ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            margin: "8px 0 0",
            minHeight: "1.5em",
          }}
        >
          Verifique suas credenciais e tente novamente.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Campo E-mail */}
          <label
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 2.6vw, 3.125rem)",
              fontWeight: 510,
              color: "#272727",
              marginBottom: "15px",
            }}
          >
            e-mail
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#EAEAEA",
              borderRadius: "60px",
              padding: "0 clamp(16px, 2.1vw, 40px)",
              width: "100%",
              height: "clamp(48px, 4.17vw, 80px)",
              marginBottom: "20px",
              border: inputError
                ? "2px solid #D92B2E"
                : "2px solid transparent",
              boxSizing: "border-box",
            }}
          >
            <Image src="/images/email.svg" alt="email" width={30} height={23} />
            <input
              type="email"
              placeholder="insira seu e-mail"
              value={email}
              onFocus={() => setInputError(false)}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                marginLeft: "15px",
                fontWeight: 400,
                fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
                color: "#535353",
              }}
              required
            />
          </div>

          {/* Campo Senha */}
          <label
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 2.6vw, 3.125rem)",
              fontWeight: 510,
              color: "#272727",
              marginBottom: "15px",
            }}
          >
            senha
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#EAEAEA",
              borderRadius: "60px",
              padding: "0 clamp(16px, 2.1vw, 40px)",
              width: "100%",
              height: "clamp(48px, 4.17vw, 80px)",
              marginBottom: "15px",
              border: inputError
                ? "2px solid #D92B2E"
                : "2px solid transparent",
              boxSizing: "border-box",
            }}
          >
            <Image
              src="/images/PasswordLock.svg"
              alt="lock"
              width={30}
              height={23}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="insira sua senha"
              value={password}
              onFocus={() => setInputError(false)}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                marginLeft: "15px",
                fontWeight: 400,
                fontSize: "clamp(0.875rem, 1.56vw, 1.875rem)",
                color: "#535353",
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Image
                src={
                  showPassword ? "/images/hide_pw.svg" : "/images/show_pw.svg"
                }
                alt={showPassword ? "ocultar senha" : "mostrar senha"}
                width={30}
                height={23}
              />
            </button>
          </div>

          {/* Esqueceu a senha */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              style={{
                fontSize: "20px",
                color: "#535353",
                textDecoration: "underline",
                marginRight: "30px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "'SF Pro Text', system-ui, sans-serif",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading}
            className={loading ? "btn-loading" : ""}
            style={{
              display: "flex",
              backgroundColor: "#E0C271",
              color: "#FAF9F5",
              border: "none",
              borderRadius: "60px",
              width: "clamp(180px, 20.83vw, 400px)",
              justifyContent: "center",
              alignItems: "center",
              height: "clamp(48px, 4.17vw, 80px)",
              fontSize: "clamp(1.5rem, 3.125vw, 3.75rem)",
              fontWeight: 600,
              margin: "0 auto 30px auto",
              cursor: loading ? "default" : "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Entrar
          </button>
        </form>

        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#535353",
            fontWeight: 500,
            fontSize: "clamp(0.875rem, 1.3vw, 1.5625rem)",
          }}
        >
          Não tem conta?{" "}
          <a
            href="/register"
            style={{
              color: "#535353",
              fontWeight: 500,
              textDecoration: "underline",
            }}
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
