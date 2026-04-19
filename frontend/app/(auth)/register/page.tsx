"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";

export default function Cadastro() {
  const router = useRouter();
  const { signup, isAuthenticated, loading, error: authError } = useSession();
  const [section, setSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [error, setError] = useState("");
  const [localError, setLocalError] = useState("");
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

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
    setLocalError("");
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
    const minDate = new Date("1910-01-01");
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    if (date < minDate) {
      return {
        valid: false,
        message:
          "Data de nascimento inválida. Você deve ter nascido após 1910.",
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
      setCompletedSections((prev) =>
        prev.includes(section) ? prev : [...prev, section]
      );
      setSection(section + 1);
    }
  };

  const goToPreviousSection = () => {
    setSection(section - 1);
    setError("");
  };

  async function handleSubmit() {
    setLocalError("");

    if (formData.senha !== formData.confirmeSenha) {
      setLocalError("As senhas não coincidem.");
      return;
    }

    const user = await signup({
      nome: formData.nome,
      email: formData.email,
      password: formData.senha,
      telefone: formData.celular,
    });

    if (user) {
      router.push("/dashboard");
      return;
    }

    setLocalError(
      authError ||
      "Falha ao criar conta. Verifique os dados e tente novamente.",
    );
  }

  const TOTAL_SECTIONS = 3;

  const handleDotClick = (dotIndex: number) => {
    const targetSection = dotIndex + 1;
    if (completedSections.includes(targetSection)) {
      // Seção já preenchida — permite navegar para ela
      setSection(targetSection);
      setError("");
    } else if (targetSection === section) {
      // Dot da seção atual — não faz nada
    } else {
      // Tentando avançar sem completar — exibe erro
      setError("Por favor, preencha todos os campos");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "0px",
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── BARRA DE PROGRESSO EM DOTS ── */}
      <div
        style={{
          position: "fixed",
          bottom: section === 3 ? "100px" : "210px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "18px",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: TOTAL_SECTIONS }).map((_, i) => {
          const targetSection = i + 1;
          const isActive = section === targetSection;
          const isCompleted = completedSections.includes(targetSection);
          const isClickable = isCompleted && !isActive;

          return (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              style={{
                pointerEvents: "auto",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: isActive ? "#E0C271" : isCompleted ? "#C3A85E" : "#272727",
                transform: isActive ? "scale(1.4)" : "scale(1)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: isClickable ? "pointer" : "default",
                padding: 0,
                opacity: isClickable ? 1 : isActive ? 1 : 0.5,
              }}
              aria-label={`Seção ${targetSection}`}
            />
          );
        })}
      </div>

      {/* Imagem de fundo - Topo Direita */}
      <div
        style={{
          position: "absolute",
          top: "30px",
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
          bottom: "40px",
          left: "40px",
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
          maxWidth: "1600px",
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
            marginTop: "25px",
            marginBottom: "-30px",
            color: "#272727",
          }}
        >
          DOMI
        </h1>

        {/* Título Cadastrar-se */}
        <h2
          style={{
            fontFamily: "'SF Pro Text', system-ui, sans-serif",
            fontSize: "130px",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "5px",
            color: "#272727",
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
                columnGap: "200px",
                rowGap: "25px",
                marginBottom: "55px", //GAP QUE EU QUERO
              }}
            >
              {/* Nome */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    backgroundColor: "#EAEAEA",
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/name.svg"
                    alt="nome"
                    width={42}
                    height={30}
                  />
                  <input
                    type="text"
                    placeholder="insira seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
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
                  />
                </div>
              </div>

              {/* Celular */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    backgroundColor: "#EAEAEA",
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/cellphone.svg"
                    alt="celular"
                    width={35}
                    height={35}
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
                      fontSize: "30px",
                      color: "#535353",
                    }}
                  />
                </div>
              </div>

              {/* E-mail */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    backgroundColor: "#EAEAEA",
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/email.svg"
                    alt="email"
                    width={37}
                    height={30}
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
                      fontSize: "30px",
                      color: "#535353",
                    }}
                  />
                </div>
              </div>

              {/* Data de Nascimento */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    backgroundColor: "#EAEAEA",
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/calendar.svg"
                    alt="data"
                    width={35}
                    height={35}
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
                      fontSize: "30px",
                      color: "#535353",
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
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Botão Seguir */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}> {/* LINHA ADICIONADA */}
              <button
                onClick={goToNextSection}
                style={{
                  backgroundColor: "#FAF9F5",
                  color: "#272727",
                  border: "4px solid #272727",
                  borderRadius: "60px",
                  width: "400px",
                  height: "80px",
                  fontSize: "60px",
                  fontWeight: 450,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Seguir
              </button>
            </div>

            {/* Divisor "ou" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "1000px",
                margin: "0 auto 24px auto",
              }}
            >
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
              <span
                style={{
                  margin: "0 15px",
                  color: "#535353",
                  fontSize: "25px",
                }}
              >
                ou
              </span>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
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
                width: "470px",
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
              Cadastrar-se com Google
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
              Já tem uma conta?{" "}
              <a
                href="/login"
                style={{
                  color: "#535353",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Entrar
              </a>
            </p>
          </>
        )}

            {/* Botão voltar */}
            <div
              onClick={section === 1 ? () => router.push("/") : goToPreviousSection}
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

        {/* SEÇÃO 2 */}
        {section === 2 && (
          <>
            {/* Container de Campos em Quadrado */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "200px",
                rowGap: "25px",
                marginBottom: "55px",
              }}
            >
              {/* CEP */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/cep.svg"
                    alt="cep"
                    width={35}
                    height={36}
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
                      fontSize: "30px",
                      color: "#535353",
                    }}
                  />
                </div>
              </div>

              {/* Senha */}
              <div style={{ gridColumn: "2 / 3" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/PasswordLock.svg"
                    alt="lock"
                    width={35}
                    height={36}
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
                      fontSize: "30px",
                      color: "#535353",
                    }}
                  />
                </div>
              </div>

              {/* Número do Endereço */}
              <div style={{ gridColumn: "1 / 2" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/cep.svg"
                    alt="endereço"
                    width={35}
                    height={36}
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
                      fontSize: "30px",
                      color: "#535353",
                    }}
                  />
                </div>
              </div>

              {/* Confirme sua Senha */}
              <div style={{ gridColumn: "2 / 3", position: "relative" }}>
                <label
                  style={{
                    fontSize: "40px",
                    fontWeight: 510,
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
                    borderRadius: "60px",
                    padding: "0 40px",
                    width: "700px",
                    height: "80px",
                  }}
                >
                  <Image
                    src="/images/PasswordLock.svg"
                    alt="lock"
                    width={35}
                    height={36}
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
                      fontSize: "30px",
                      color: "#535353",
                    }}
                  />
                </div>

                {/* ── Checkbox Termos de Uso ── */}
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 15px)",
                    left: "95px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setTermosAceitos((v) => !v)}
                >
                  {/* Checkbox vazada */}
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "4px",
                      border: `2px solid ${termosAceitos ? "#E0C271" : "#535353"}`,
                      backgroundColor: termosAceitos ? "#E0C271" : "transparent",
                      flexShrink: 0,
                      transition: "background-color 0.2s ease, border-color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {termosAceitos && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4L4.5 7.5L11 1" stroke="#FAF9F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Texto */}
                  <span
                    style={{
                      fontFamily: "'SF Pro Text', system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: "20px",
                      color: "#535353",
                      lineHeight: 1.3,
                    }}
                  >
                    Concordo com os{" "}
                    <a href="/termos" onClick={(e) => e.stopPropagation()} style={{ color: "#535353", fontWeight: 400, textDecoration: "underline" }}>
                      Termos de Uso
                    </a>
                    {" "}e a{" "}
                    <a href="/privacidade" onClick={(e) => e.stopPropagation()} style={{ color: "#535353", fontWeight: 400, textDecoration: "underline" }}>
                      Política de Privacidade
                    </a>
                    .
                  </span>
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}> {/* LINHA ADICIONADA */}
              <button
                onClick={goToNextSection}
                style={{
                  backgroundColor: "#FAF9F5",
                  color: "#272727",
                  border: "4px solid #272727",
                  borderRadius: "60px",
                  width: "400px",
                  height: "80px",
                  fontSize: "60px",
                  fontWeight: 450,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Enviar
              </button>
            </div>

            {/* Divisor "ou" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "1000px",
                margin: "0 auto 25px auto",
              }}
            >
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
              <span
                style={{
                  margin: "0 15px",
                  color: "#535353",
                  fontSize: "25px",
                }}
              >
                ou
              </span>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
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
                width: "470px",
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
              Cadastrar-se com Google
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
              Já tem uma conta?{" "}
              <a
                href="/login"
                style={{
                  color: "#535353",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Entrar
              </a>
            </p>

            {/* Botão voltar */}
            <div
              onClick={goToPreviousSection}
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

          </>
        )}

        {/* SEÇÃO 3 */}
        {section === 3 && (
          <>
            {/* Texto Celular */}
            <p
              style={{
                fontSize: "35px",
                fontWeight: 510,
                color: "#272727",
                textAlign: "center",
                marginTop: "5px",
                marginBottom: "15px",
              }}
            >
              verifique sua conta pelo código enviado pelo celular
            </p>

            {/* Divisor "ou" */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "800px",
                margin: "0 auto 15px auto",
              }}
            >
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
              <span
                style={{
                  margin: "0 15px",
                  color: "#535353",
                  fontSize: "25px",
                }}
              >
                ou
              </span>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
            </div>

            {/* Texto E-mail */}
            <p
              style={{
                fontSize: "35px",
                fontWeight: 510,
                color: "#272727",
                textAlign: "center",
                margin: "0 auto 30px auto",
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
                marginBottom: "60px",
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
                    width: "200px",
                    height: "200px",
                    border: "5px solid #E0C271",
                    borderRadius: "30px",
                    backgroundColor: "transparent",
                    fontSize: "60px",
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

            {(localError || authError) && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "16px",
                  borderRadius: "24px",
                  backgroundColor: "#FEF2F2",
                  color: "#B91C1C",
                  border: "1px solid #FECACA",
                  textAlign: "center",
                  width: "400px",
                  margin: "0 auto 20px auto",
                }}
              >
                {localError || authError}
              </div>
            )}

            {/* Botão voltar */}
            <div
              onClick={goToPreviousSection}
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

            {/* Botão Cadastrar-se */}
            <button
              type="button"
              disabled={loading}
              style={{
                display: "flex",
                backgroundColor: "#E0C271",
                color: "#FAF9F5",
                border: "none",
                borderRadius: "60px",
                width: "440px",
                justifyContent: "center",
                alignItems: "center",
                height: "80px",
                fontSize: "60px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.2s ease",
                margin: "0 auto 65px auto",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={handleSubmit}
            >
              {loading ? "Cadastrando..." : "Cadastrar-se"}
            </button>

            {/* Link para Entrar */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                color: "#535353",
                fontWeight: 500,
                fontSize: "25px",
              }}
            >
              Já tem uma conta?{" "}
              <a
                href="/login"
                style={{
                  color: "#535353",
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Entrar
              </a>
            </div>
          </>
        )}
      </div>
    </div >
  );
}