"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, loading, error } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError("");

    const user = await login({ email, password });
    if (user) {
      router.push("/dashboard");
      return;
    }

    setLocalError("Verifique suas credenciais e tente novamente.");
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
          src="/images/logo_domi.png"
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
          src="/images/logo_domi.png"
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
          top: "46px",
          left: "51px",
          fontSize: "30px",
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
          fontWeight: 500,
          color: "#272727",
          cursor: "pointer",
          userSelect: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
           ← Voltar
          </div>

      {/* Container Principal do Formulário */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <h1
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontSize: "60px",
            fontWeight: 900,
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "-30px",
            color: "#272727",
          }}
        >
          DOMI
        </h1>

        {/* Título Entrar */}
        <h2
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontSize: "130px",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "0px",
            color: "#272727",
          }}
        >
          Entrar
        </h2>

        {(localError || error) && (
          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              borderRadius: "24px",
              backgroundColor: "#FEF2F2",
              color: "#B91C1C",
              border: "1px solid #FECACA",
              textAlign: "center",
            }}
          >
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo E-mail */}
          <label
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontSize: "50px",
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
              padding: "0 40px",
              width: "100%",
              height: "80px",
              marginBottom: "20px",
            }}
          >
            <Image src="/images/email.svg" alt="email" width={30} height={23} />
            <input
              type="email"
              placeholder="insira seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                marginLeft: "15px",
                fontWeight: 400,
                fontSize: "30px",
                color: "#535353",
              }}
              required
            />
          </div>

          {/* Campo Senha */}
          <label
            style={{
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
              fontSize: "50px",
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
              padding: "0 40px",
              width: "100%",
              height: "80px",
              marginBottom: "15px",
            }}
          >
            <Image
              src="/images/PasswordLock.svg"
              alt="lock"
              width={30}
              height={23}
            />
            <input
              type="password"
              placeholder="insira sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                marginLeft: "15px",
                fontWeight: 400,
                fontSize: "30px",
                color: "#535353",
              }}
              required
            />
          </div>

          {/* Esqueceu a senha */}
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <a
              href="#"
              style={{
                fontSize: "20px",
                color: "#535353",
                textDecoration: "underline",
                marginRight: "30px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#272727")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#535353")}
            >
              Esqueceu a senha?
            </a>
          </div>

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              backgroundColor: "#E0C271",
              color: "#FAF9F5",
              border: "none",
              borderRadius: "60px",
              width: "400px",
              justifyContent: "center",
              alignItems: "center",
              height: "80px",
              fontSize: "60px",
              fontWeight: 600,
              marginBottom: "25px",
              transition: "transform 0.2s ease",
              margin: "0 auto 30px auto",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Divisor "ou" */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "0px 0 25px 0",
          }}
        >
          <div style={{ flex: 1, height: "3px", backgroundColor: "#C3A85E" }} />
          <span
            style={{
              margin: "0 15px",
              color: "#535353",
              fontSize: "25px",
            }}
          >
            ou
          </span>
          <div style={{ flex: 1, height: "3px", backgroundColor: "#C3A85E" }} />
        </div>

        {/* Botão Google */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#272727",
            color: "#FAF9F5",
            border: "none",
            borderRadius: "50px",
            width: "385px",
            height: "60px",
            fontSize: "30px",
            fontWeight: 400,
            cursor: "pointer",
            margin: "0 auto",
            gap: "12px",
            transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Image
            src="/images/GoogleIcon.svg"
            alt="Google"
            width={35}
            height={35}
          />
          Entrar com Google
        </button>

        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#535353",
            fontWeight: 500,
            fontSize: "25px",
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