"use client";

import { useState } from "react";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Imagem de fundo - Topo Direita */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "150px",
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
          bottom: "50px",
          left: "150px",
          opacity: 0.05,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Image
          src="/images/logo_domi.png"
          alt="Logo decorativa"
          width={500}
          height={427}
        />
      </div>

      {/* Container Principal do Formulário */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
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
            fontSize: "40px",
            fontWeight: 900,
            textAlign: "center",
            margin: 0,
            color: "#272727",
            letterSpacing: "-1px",
          }}
        >
          DOMI
        </h1>

        {/* Título Entrar */}
        <h2
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontSize: "100px",
            fontWeight: 700,
            textAlign: "center",
            marginTop: "10px",
            marginBottom: "40px",
            color: "#272727",
            letterSpacing: "-2px",
          }}
        >
          Entrar
        </h2>

        {/* Campo E-mail */}
        <label
          style={{
            fontSize: "28px",
            fontWeight: 500,
            color: "#272727",
            marginBottom: "10px",
          }}
        >
          e-mail
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#EBEBEB",
            borderRadius: "50px",
            padding: "0 20px",
            width: "100%",
            height: "60px",
            marginBottom: "20px",
          }}
        >
          <Image src="/images/email.svg" alt="email" width={20} height={20} />
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
              fontSize: "18px",
              color: "#333",
            }}
          />
        </div>

        {/* Campo Senha */}
        <label
          style={{
            fontSize: "28px",
            fontWeight: 500,
            color: "#272727",
            marginBottom: "10px",
          }}
        >
          senha
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#EBEBEB",
            borderRadius: "50px",
            padding: "0 20px",
            width: "100%",
            height: "60px",
            marginBottom: "10px",
          }}
        >
          <Image
            src="/images/PasswordLock.svg"
            alt="lock"
            width={20}
            height={20}
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
              fontSize: "18px",
              color: "#333",
            }}
          />
        </div>

        {/* Esqueceu a senha */}
        <div style={{ textAlign: "right", marginBottom: "40px" }}>
          <a
            href="#"
            style={{
              fontSize: "14px",
              color: "#555",
              textDecoration: "underline",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#000")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            Esqueceu a senha?
          </a>
        </div>

        {/* Botão Entrar */}
        <button
          style={{
            backgroundColor: "#E0C271",
            color: "#FFF",
            border: "none",
            borderRadius: "50px",
            width: "400px",
            height: "65px",
            fontSize: "28px",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "20px",
            transition: "opacity 0.3s ease",
            margin: "0 auto 30px auto",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Entrar
        </button>

        {/* Divisor "ou" */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "10px 0 30px 0",
          }}
        >
          <div style={{ flex: 1, height: "2px", backgroundColor: "#E0C271" }} />
          <span
            style={{
              margin: "0 15px",
              color: "#555",
              fontSize: "18px",
            }}
          >
            ou
          </span>
          <div style={{ flex: 1, height: "2px", backgroundColor: "#E0C271" }} />
        </div>

        {/* Botão Google */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1A1A1A",
            color: "#FFF",
            border: "none",
            borderRadius: "50px",
            height: "60px",
            fontSize: "18px",
            fontWeight: 500,
            cursor: "pointer",
            marginBottom: "30px",
            width: "400px",
            margin: "0 auto 30px auto",
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <Image
            src="/images/GoogleIcon.svg"
            alt="Google"
            width={24}
            height={24}
            style={{ marginRight: "10px" }}
          />
          Continue with Google
        </button>

        {/* Cadastro */}
        <div style={{ textAlign: "center", fontSize: "16px", color: "#555" }}>
          Não tem uma conta?{" "}
          <a
            href="/cadastro"
            style={{
              color: "#555",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
}
