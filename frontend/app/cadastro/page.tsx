"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Cadastro() {
  const [section, setSection] = useState(1);
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const verificationInputs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    email: "",
    dataNascimento: "",
    cep: "",
    numeroEndereco: "",
    senha: "",
    confirmeSenha: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const validateSection = (sectionNum: number): boolean => {
    if (sectionNum === 1) {
      if (
        !formData.nome ||
        !formData.celular ||
        !formData.email ||
        !formData.dataNascimento
      ) {
        setError("Por favor, preencha todos os campos");
        return false;
      }
      if (!isEmailValid(formData.email)) {
        setError(
          "Email inválido. Certifique-se de incluir @ e um domínio válido",
        );
        return false;
      }
      if (formData.celular.replace(/\D/g, "").length < 11) {
        setError("Telefone inválido. Digite um número com 11 dígitos");
        return false;
      }
      if (!isDateValid(formData.dataNascimento).valid) {
        const validation = isDateValid(formData.dataNascimento);
        setError(validation.message);
        return false;
      }
    } else if (sectionNum === 2) {
      if (
        !formData.cep ||
        !formData.numeroEndereco ||
        !formData.senha ||
        !formData.confirmeSenha
      ) {
        setError("Por favor, preencha todos os campos");
        return false;
      }
      if (formData.cep.replace(/\D/g, "").length < 8) {
        setError("CEP inválido. Digite um CEP com 8 dígitos");
        return false;
      }
      if (formData.senha !== formData.confirmeSenha) {
        setError("As senhas não coincidem");
        return false;
      }
    }
    return true;
  };

  const isDateValid = (
    dateString: string,
  ): { valid: boolean; message: string } => {
    const date = new Date(dateString);
    const minDate = new Date("1920-01-01");
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    if (date < minDate) {
      return {
        valid: false,
        message:
          "Data de nascimento inválida. Você deve ter nascido após 1920.",
      };
    }

    if (date > maxDate) {
      return {
        valid: false,
        message:
          "Data de nascimento inválida. Você deve ter pelo menos 18 anos.",
      };
    }

    return { valid: true, message: "" };
  };

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length === 0) return "";
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, "").slice(0, 8);

    if (numbers.length === 0) return "";
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  };

  const formatAddressNumber = (value: string): string => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const handleVerificationInput = (index: number, value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = numbers;
    setVerificationCode(newCode);

    if (numbers && index < 3) {
      verificationInputs.current[index + 1]?.focus();
    }
  };

  const handleVerificationKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      verificationInputs.current[index - 1]?.focus();
    }
  };

  const goToNextSection = () => {
    if (validateSection(section)) {
      setSection(section + 1);
    }
  };

  const goToPreviousSection = () => {
    setSection(section - 1);
    setError("");
  };

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
          width={373}
          height={318}
        />
      </div>

      {/* Container Principal do Formulário */}
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
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

        {/* Título Cadastrar-se */}
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
          Cadastrar-se
        </h2>

        {/* SEÇÃO 1 */}
        {section === 1 && (
          <>
            {/* Container de Campos em Quadrado */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "250px",
                rowGap: "30px",
                marginBottom: "30px",
              }}
            >
              {/* Nome */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  nome
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50px",
                    padding: "0 20px",
                    width: "550px",
                    height: "60px",
                  }}
                >
                  <Image
                    src="/images/name.svg"
                    alt="nome"
                    width={20}
                    height={20}
                  />
                  <input
                    type="text"
                    placeholder="insira seu nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
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
              </div>

              {/* Celular */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  celular
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50px",
                    padding: "0 20px",
                    width: "550px",
                    height: "60px",
                  }}
                >
                  <Image
                    src="/images/cellphone.svg"
                    alt="celular"
                    width={20}
                    height={20}
                  />
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.celular}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value);
                      handleInputChange("celular", formatted);
                    }}
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
              </div>

              {/* E-mail */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
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
                    width: "550px",
                    height: "60px",
                  }}
                >
                  <Image
                    src="/images/email.svg"
                    alt="email"
                    width={20}
                    height={20}
                  />
                  <input
                    type="email"
                    placeholder="insira seu e-mail"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    maxLength={254}
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
              </div>

              {/* Data de Nascimento */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  data de nascimento
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50px",
                    padding: "0 20px",
                    width: "550px",
                    height: "60px",
                  }}
                >
                  <Image
                    src="/images/calendar.svg"
                    alt="data"
                    width={20}
                    height={20}
                  />
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                      handleInputChange("dataNascimento", e.target.value)
                    }
                    min="1920-01-01"
                    max={
                      new Date(
                        new Date().getFullYear() - 18,
                        new Date().getMonth(),
                        new Date().getDate(),
                      )
                        .toISOString()
                        .split("T")[0]
                    }
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
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div
                style={{
                  color: "#FF0000",
                  fontSize: "16px",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Botão Seguir */}
            <button
              onClick={goToNextSection}
              style={{
                backgroundColor: "#FAF9F5",
                color: "#272727",
                border: "2px solid #272727",
                borderRadius: "50px",
                width: "400px",
                height: "65px",
                fontSize: "28px",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "20px",
                transition: "all 0.3s ease",
                margin: "0 auto 20px auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E0C271";
                e.currentTarget.style.color = "#FAF9F5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FAF9F5";
                e.currentTarget.style.color = "#272727";
              }}
            >
              Seguir
            </button>

            {/* Barra de Progresso - Seção 1 */}
            <div
              style={{
                display: "flex",
                marginBottom: "30px",
                margin: "0 auto 30px auto",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "15px",
                  backgroundColor: "#E0C271",
                }}
              />
              <div
                style={{
                  width: "400px",
                  height: "15px",
                  backgroundColor: "#979797",
                }}
              />
            </div>

            {/* Divisor "ou" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px auto 30px auto",
                width: "600px",
              }}
            >
              <div
                style={{
                  width: "300px",
                  height: "2px",
                  backgroundColor: "#E0C271",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  margin: "0 15px",
                  color: "#555",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                ou
              </span>
              <div
                style={{
                  width: "300px",
                  height: "2px",
                  backgroundColor: "#E0C271",
                  flexShrink: 0,
                }}
              />
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

            {/* Link para login */}
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                color: "#555",
              }}
            >
              Já tem uma conta?{" "}
              <a
                href="/login"
                style={{
                  color: "#555",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Entrar
              </a>
            </div>
          </>
        )}

        {/* SEÇÃO 2 */}
        {section === 2 && (
          <>
            {/* Container de Campos em Quadrado */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "250px",
                rowGap: "30px",
                marginBottom: "30px",
              }}
            >
              {/* CEP */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  CEP
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50px",
                    padding: "0 20px",
                    width: "550px",
                    height: "60px",
                  }}
                >
                  <Image
                    src="/images/cep.svg"
                    alt="cep"
                    width={20}
                    height={20}
                  />
                  <input
                    type="text"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => {
                      const formatted = formatCEP(e.target.value);
                      handleInputChange("cep", formatted);
                    }}
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
              </div>

              {/* Senha */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
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
                    width: "550px",
                    height: "60px",
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
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
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
              </div>

              {/* Número do Endereço */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  número do endereço
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50px",
                    padding: "0 20px",
                    width: "550px",
                    height: "60px",
                  }}
                >
                  <Image
                    src="/images/cep.svg"
                    alt="endereço"
                    width={20}
                    height={20}
                  />
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.numeroEndereco}
                    onChange={(e) => {
                      const formatted = formatAddressNumber(e.target.value);
                      handleInputChange("numeroEndereco", formatted);
                    }}
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
              </div>

              {/* Confirme sua Senha */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: "#272727",
                    marginBottom: "10px",
                    display: "block",
                  }}
                >
                  confirme sua senha
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#EBEBEB",
                    borderRadius: "50px",
                    padding: "0 20px",
                    width: "550px",
                    height: "60px",
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
                    placeholder="confirme sua senha"
                    value={formData.confirmeSenha}
                    onChange={(e) =>
                      handleInputChange("confirmeSenha", e.target.value)
                    }
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
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div
                style={{
                  color: "#FF0000",
                  fontSize: "16px",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Botão Enviar */}
            <button
              onClick={goToNextSection}
              style={{
                backgroundColor: "#FAF9F5",
                color: "#272727",
                border: "2px solid #272727",
                borderRadius: "50px",
                width: "400px",
                height: "65px",
                fontSize: "28px",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "20px",
                transition: "all 0.3s ease",
                margin: "0 auto 20px auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E0C271";
                e.currentTarget.style.color = "#FAF9F5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FAF9F5";
                e.currentTarget.style.color = "#272727";
              }}
            >
              Enviar
            </button>

            {/* Barra de Progresso - Seção 2 */}
            <div
              style={{
                display: "flex",
                marginBottom: "30px",
                margin: "0 auto 30px auto",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "400px",
                  height: "15px",
                  backgroundColor: "#E0C271",
                }}
              />
              <div
                style={{
                  width: "200px",
                  height: "15px",
                  backgroundColor: "#979797",
                }}
              />
            </div>

            {/* Divisor "ou" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px auto 30px auto",
                width: "600px",
              }}
            >
              <div
                style={{
                  width: "300px",
                  height: "2px",
                  backgroundColor: "#E0C271",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  margin: "0 15px",
                  color: "#555",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                ou
              </span>
              <div
                style={{
                  width: "300px",
                  height: "2px",
                  backgroundColor: "#E0C271",
                  flexShrink: 0,
                }}
              />
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

            {/* Botão voltar */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={goToPreviousSection}
                style={{
                  fontSize: "16px",
                  color: "#555",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Voltar
              </button>
            </div>
          </>
        )}

        {/* SEÇÃO 3 */}
        {section === 3 && (
          <>
            {/* Texto Celular */}
            <p
              style={{
                fontSize: "26px",
                fontWeight: 500,
                color: "#272727",
                textAlign: "center",
                margin: "0 auto 20px auto",
              }}
            >
              verifique sua conta pelo código enviado pelo celular
            </p>

            {/* Divisor "ou" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
                width: "600px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: "#E0C271",
                }}
              />
              <span
                style={{
                  margin: "0 15px",
                  color: "#555",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                ou
              </span>
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: "#E0C271",
                }}
              />
            </div>

            {/* Texto E-mail */}
            <p
              style={{
                fontSize: "26px",
                fontWeight: 500,
                color: "#272727",
                textAlign: "center",
                margin: "0 auto 40px auto",
              }}
            >
              verifique sua conta pelo código enviado pelo e-mail
            </p>

            {/* Quadrados de Código (Inputs) */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                marginBottom: "50px",
              }}
            >
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    verificationInputs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={verificationCode[index]}
                  onChange={(e) =>
                    handleVerificationInput(index, e.target.value)
                  }
                  onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                  style={{
                    width: "110px",
                    height: "110px",
                    border: "3px solid #E0C271",
                    borderRadius: "15px",
                    backgroundColor: "transparent",
                    fontSize: "48px",
                    fontWeight: 600,
                    textAlign: "center",
                    color: "#272727",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#272727")}
                  onBlur={(e) => (e.target.style.borderColor = "#E0C271")}
                />
              ))}
            </div>

            {/* Botão Cadastrar-se */}
            <button
              style={{
                display: "block",
                backgroundColor: "#E0C271",
                color: "#FFF",
                border: "none",
                borderRadius: "50px",
                width: "400px",
                height: "65px",
                fontSize: "28px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.3s ease",
                margin: "0 auto 30px auto",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              onClick={() => alert("Cadastro finalizado com sucesso!")}
            >
              Cadastrar-se
            </button>

            {/* Barra de Progresso - Seção 3 (100% preenchida) */}
            <div
              style={{
                display: "flex",
                margin: "0 auto 30px auto",
                borderRadius: "10px",
                overflow: "hidden",
                width: "600px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "15px",
                  backgroundColor: "#E0C271",
                }}
              />
            </div>

            {/* Link para Entrar */}
            <div
              style={{
                textAlign: "center",
                fontSize: "16px",
                color: "#555",
                marginBottom: "15px",
              }}
            >
              Já tem uma conta?{" "}
              <a
                href="/login"
                style={{
                  color: "#555",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Entrar
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
