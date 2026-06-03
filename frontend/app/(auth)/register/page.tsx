"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/contexts/AuthContext";
import { AuthGateway } from "@/lib/gateways/AuthGateway";
import { DocumentoGateway } from "@/lib/gateways/DocumentoGateway";
import { apiClient } from "@/lib/api/client";

export default function Cadastro() {
  const router = useRouter();
  const { isAuthenticated, loading } = useSession();
  const [section, setSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [error, setError] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmeSenha, setShowConfirmeSenha] = useState(false);
  const [showError, setShowError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [localError, setLocalError] = useState("");
  const [showError3, setShowError3] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [documentoFile, setDocumentoFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [numeroDocumento, setNumeroDocumento] = useState("");

  const dateInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflowY = "";
    };
  }, []);

  const triggerError = (message: string) => {
    setError(message);
    setInputError(true);
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  };

  const triggerError3 = (message: string) => {
    setLocalError(message);
    setShowError3(true);
  };

  const clearInputError = () => setInputError(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setLocalError("");
  };

  const validateSection = (sectionNum: number): boolean => {
    if (sectionNum === 1) {
      if (!formData.nome || !formData.celular || !formData.email || !formData.dataNascimento) {
        triggerError("Preencha todos os campos corretamente.");
        return false;
      }
      if (!isEmailValid(formData.email)) {
        triggerError("e-mail inválido.");
        return false;
      }
      if (formData.celular.replace(/\D/g, "").length < 11) {
        triggerError("Número de celular inválido.");
        return false;
      }
      if (!isDateValid(formData.dataNascimento).valid) {
        triggerError("Data de nascimento inválida.");
        return false;
      }
    } else if (sectionNum === 2) {
      if (!formData.cep || !formData.numeroEndereco || !formData.senha || !formData.confirmeSenha) {
        triggerError("Preencha todos os campos corretamente.");
        return false;
      }
      if (formData.cep.replace(/\D/g, "").length < 8) {
        triggerError("CEP inválido.");
        return false;
      }
      if (formData.senha !== formData.confirmeSenha) {
        triggerError("As senhas digitadas devem ser iguais.");
        return false;
      }
      if (!termosAceitos) {
        triggerError("Aceite os Termos de Uso e a Política de Privacidade para continuar.");
        return false;
      }
    }
    return true;
  };

  const isDateValid = (dateString: string): { valid: boolean; message: string } => {
    const date = new Date(dateString);
    const minDate = new Date("1910-01-01");
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    if (date < minDate) return { valid: false, message: "Data inválida." };
    if (date > maxDate) return { valid: false, message: "Você deve ter pelo menos 18 anos." };
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
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
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

  const goToNextSection = () => {
    if (validateSection(section)) {
      setCompletedSections((prev) => prev.includes(section) ? prev : [...prev, section]);
      setSection(section + 1);
    }
  };

  const goToPreviousSection = () => {
    setSection(section - 1);
    setError("");
    setShowError(false);
    setInputError(false);
    setLocalError("");
  };

  async function handleSubmit() {
    if (!documentoFile || !selfieFile) {
      triggerError3("Envie a foto do documento e a selfie.");
      return;
    }

    setIsSubmitting(true);
    setLocalError("");

    try {
      // 1. Registra o usuário
      const response = await AuthGateway.registerClient({
        email: formData.email,
        senha: formData.senha,
        cpf: numeroDocumento.replace(/\D/g, ""),
      });

      const token = response.token;
      const userId = (response.user as any)?.id;

      if (!userId || !token) {
        triggerError3("Erro ao identificar o usuário. Tente novamente.");
        return;
      }

      // 2. Cria o perfil do usuário
      await apiClient.post(
        "/usuario/criarUsuario",
        { user_id: userId, nome: formData.nome },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // 3. Envia documentos (aprovação automática)
      await DocumentoGateway.enviarDocumentos(
        {
          user_id: userId,
          tipo: "RG",
          numero_documento: numeroDocumento,
          documento: documentoFile,
          selfie: selfieFile,
        },
        token,
      );

      router.push("/login");
    } catch (erro: any) {
      triggerError3(erro?.message || "Erro ao concluir o cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const TOTAL_SECTIONS = 3;

  const handleDotClick = (dotIndex: number) => {
    const targetSection = dotIndex + 1;
    if (completedSections.includes(targetSection)) {
      setSection(targetSection);
      setError("");
      setShowError(false);
      setInputError(false);
    } else if (targetSection === section) {
      return;
    } else {
      triggerError("Preencha todos os campos corretamente.");
    }
  };

  const fieldBorder = inputError ? "2px solid #D92B2E" : "2px solid transparent";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "0px",
        paddingBottom: "120px",
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
        position: "relative",
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
        input[type="date"]::-webkit-calendar-picker-indicator {
          display: none;
          -webkit-appearance: none;
        }
        input[type="date"] {
          -moz-appearance: textfield;
        }
        input[type="file"]::file-selector-button {
          border: none;
          border-radius: 30px;
          background-color: #E0C271;
          color: #FAF9F5;
          padding: 12px 24px;
          cursor: pointer;
          font-weight: 600;
          margin-right: 18px;
        }
      `}</style>

      {/* Dots de progresso */}
      <div
        style={{
          position: "fixed",
          bottom: "60px",
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
      <div style={{ position: "fixed", top: "30px", right: "150px", opacity: 0.05, pointerEvents: "none", zIndex: 0 }}>
        <Image src="/images/logo_domi.svg" alt="" width={346} height={295} priority style={{ transform: "scaleX(-1)" }} />
      </div>

      {/* Imagem de fundo - Base Esquerda */}
      <div style={{ position: "fixed", bottom: "40px", left: "40px", opacity: 0.05, pointerEvents: "none", zIndex: 0 }}>
        <Image src="/images/logo_domi.svg" alt="" width={373} height={318} />
      </div>

      {/* Container Principal */}
      <div style={{ width: "100%", maxWidth: "1600px", display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>

        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "60px", fontWeight: 900, textAlign: "center", marginTop: "25px", marginBottom: "-30px", color: "#272727" }}>
          DOMI
        </h1>
        <h2 style={{ fontFamily: "'SF Pro Text', system-ui, sans-serif", fontSize: "130px", fontWeight: 700, textAlign: "center", marginBottom: "5px", color: "#272727" }}>
          Cadastrar-se
        </h2>

        {/* Erro flutuante seções 1 e 2 */}
        {section !== 3 && (
          <div style={{ position: "relative", height: 0 }}>
            <p style={{ position: "absolute", top: "340px", left: 0, right: 0, fontWeight: 400, fontSize: "20px", color: "#D92B2E", textAlign: "center", opacity: showError ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none", margin: 0, whiteSpace: "nowrap" }}>
              {error || "Preencha todos os campos corretamente."}
            </p>
          </div>
        )}

        {/* ── SEÇÃO 1 ── */}
        {section === 1 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "200px", rowGap: "25px", marginBottom: "55px" }}>
              <div style={{ gridColumn: "1 / 2" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>nome</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EAEAEA", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/name.svg" alt="nome" width={42} height={30} />
                  <input type="text" placeholder="insira seu nome completo" value={formData.nome} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontWeight: 400, fontSize: "30px", color: "#535353" }} />
                </div>
              </div>

              <div style={{ gridColumn: "2 / 3" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>celular</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EAEAEA", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/cellphone.svg" alt="celular" width={35} height={35} />
                  <input type="tel" placeholder="(11) 99999-9999" value={formData.celular} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("celular", formatPhone(e.target.value))}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                </div>
              </div>

              <div style={{ gridColumn: "1 / 2" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>e-mail</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EAEAEA", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/email.svg" alt="email" width={37} height={30} />
                  <input type="email" placeholder="insira seu e-mail" value={formData.email} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("email", e.target.value)} maxLength={254}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                </div>
              </div>

              <div style={{ gridColumn: "2 / 3" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>data de nascimento</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EAEAEA", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/calendar.svg" alt="data" width={35} height={35} style={{ flexShrink: 0, cursor: "pointer" }} onClick={() => dateInputRef.current?.showPicker()} />
                  <input ref={dateInputRef} type="date" value={formData.dataNascimento} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                    min="1920-01-01"
                    max={new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <button onClick={goToNextSection}
                style={{ backgroundColor: "#FAF9F5", color: "#272727", border: "4px solid #272727", borderRadius: "60px", width: "400px", height: "80px", fontSize: "60px", fontWeight: 450, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", transition: "transform 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                Seguir
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", width: "1000px", margin: "0 auto 24px auto" }}>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
              <span style={{ margin: "0 15px", color: "#535353", fontSize: "25px" }}>ou</span>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
            </div>

            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#272727", color: "#FAF9F5", border: "none", borderRadius: "50px", width: "470px", height: "60px", fontSize: "30px", fontWeight: 400, cursor: "pointer", margin: "0 auto", gap: "12px", transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
              <Image src="/images/GoogleIcon.svg" alt="Google" width={35} height={35} />
              Cadastrar-se com Google
            </button>

            <p style={{ marginTop: "30px", textAlign: "center", color: "#535353", fontWeight: 500, fontSize: "25px" }}>
              Já tem uma conta?{" "}
              <a href="/login" style={{ color: "#535353", fontWeight: 500, textDecoration: "underline" }}>Entrar</a>
            </p>

            <div onClick={() => router.push("/")}
              style={{ position: "fixed", top: "46px", left: "51px", fontSize: "30px", fontWeight: 500, color: "#272727", cursor: "pointer", userSelect: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
              ← Voltar
            </div>
          </>
        )}

        {/* ── SEÇÃO 2 ── */}
        {section === 2 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "200px", rowGap: "25px", marginBottom: "55px" }}>

              <div style={{ gridColumn: "1 / 2" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>CEP</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EBEBEB", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/cep.svg" alt="cep" width={35} height={36} />
                  <input type="text" placeholder="00000-000" value={formData.cep} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("cep", formatCEP(e.target.value))}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                </div>
              </div>

              <div style={{ gridColumn: "2 / 3" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>senha</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EBEBEB", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/PasswordLock.svg" alt="lock" width={35} height={36} />
                  <input type={showSenha ? "text" : "password"} placeholder="insira sua senha" value={formData.senha} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                  <button type="button" onClick={() => setShowSenha((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <Image src={showSenha ? "/images/hide_pw.svg" : "/images/show_pw.svg"} alt={showSenha ? "ocultar" : "mostrar"} width={30} height={23} />
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: "1 / 2" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>número do endereço</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EBEBEB", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/cep.svg" alt="endereço" width={35} height={36} />
                  <input type="text" placeholder="123" value={formData.numeroEndereco} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("numeroEndereco", formatAddressNumber(e.target.value))}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                </div>
              </div>

              <div style={{ gridColumn: "2 / 3", position: "relative" }}>
                <label style={{ fontSize: "40px", fontWeight: 510, color: "#272727", marginBottom: "10px", display: "block" }}>confirme sua senha</label>
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "#EBEBEB", borderRadius: "60px", padding: "0 40px", width: "700px", height: "80px", border: fieldBorder, boxSizing: "border-box" }}>
                  <Image src="/images/PasswordLock.svg" alt="lock" width={35} height={36} />
                  <input type={showConfirmeSenha ? "text" : "password"} placeholder="confirme sua senha" value={formData.confirmeSenha} onFocus={clearInputError}
                    onChange={(e) => handleInputChange("confirmeSenha", e.target.value)}
                    style={{ flex: 1, border: "none", backgroundColor: "transparent", outline: "none", marginLeft: "15px", fontSize: "30px", color: "#535353" }} />
                  <button type="button" onClick={() => setShowConfirmeSenha((v) => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <Image src={showConfirmeSenha ? "/images/hide_pw.svg" : "/images/show_pw.svg"} alt={showConfirmeSenha ? "ocultar" : "mostrar"} width={30} height={23} />
                  </button>
                </div>

                <div
                  style={{ position: "absolute", top: "calc(100% + 15px)", left: "230px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", userSelect: "none" }}
                  onClick={() => { setTermosAceitos((v) => !v); clearInputError(); }}
                >
                  <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: `2px solid ${termosAceitos ? "#E0C271" : inputError ? "#D92B2E" : "#535353"}`, backgroundColor: termosAceitos ? "#E0C271" : "transparent", flexShrink: 0, transition: "background-color 0.2s ease, border-color 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {termosAceitos && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4L4.5 7.5L11 1" stroke="#FAF9F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontWeight: 400, fontSize: "15px", color: inputError && !termosAceitos ? "#D92B2E" : "#535353", lineHeight: 1.3, transition: "color 0.2s ease" }}>
                    Concordo com os{" "}
                    <a href="/termos" onClick={(e) => e.stopPropagation()} style={{ color: "inherit", textDecoration: "underline" }}>Termos de Uso</a>
                    {" "}e a{" "}
                    <a href="/privacidade" onClick={(e) => e.stopPropagation()} style={{ color: "inherit", textDecoration: "underline" }}>Política de Privacidade</a>.
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <button onClick={goToNextSection}
                style={{ backgroundColor: "#FAF9F5", color: "#272727", border: "4px solid #272727", borderRadius: "60px", width: "400px", height: "80px", fontSize: "60px", fontWeight: 450, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", transition: "transform 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                Seguir
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", width: "1000px", margin: "0 auto 25px auto" }}>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
              <span style={{ margin: "0 15px", color: "#535353", fontSize: "25px" }}>ou</span>
              <div style={{ width: "475px", height: "3px", backgroundColor: "#C3A85E" }} />
            </div>

            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#272727", color: "#FAF9F5", border: "none", borderRadius: "50px", width: "470px", height: "60px", fontSize: "30px", fontWeight: 400, cursor: "pointer", margin: "0 auto", gap: "12px", transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
              <Image src="/images/GoogleIcon.svg" alt="Google" width={35} height={35} />
              Cadastrar-se com Google
            </button>

            <p style={{ marginTop: "30px", textAlign: "center", color: "#535353", fontWeight: 500, fontSize: "25px" }}>
              Já tem uma conta?{" "}
              <a href="/login" style={{ color: "#535353", fontWeight: 500, textDecoration: "underline" }}>Entrar</a>
            </p>

            <div onClick={goToPreviousSection}
              style={{ position: "fixed", top: "46px", left: "51px", fontSize: "30px", fontWeight: 500, color: "#272727", cursor: "pointer", userSelect: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
              ← Voltar
            </div>
          </>
        )}

        {/* ── SEÇÃO 3 — Upload de documentos ── */}
        {section === 3 && (
          <>
            <div style={{ position: "relative", height: 0 }}>
              <p style={{ position: "absolute", top: "20px", left: 0, right: 0, fontWeight: 400, fontSize: "20px", color: "#D92B2E", textAlign: "center", opacity: showError3 ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none", margin: 0, whiteSpace: "nowrap" }}>
                {localError || "Envie a foto do documento e a selfie."}
              </p>
            </div>

            <p style={{ fontSize: "35px", fontWeight: 510, color: "#272727", textAlign: "center", marginTop: "15px", marginBottom: "10px" }}>
              envie sua foto de documento
            </p>

            <div style={{ display: "flex", alignItems: "center", width: "800px", margin: "0 auto 10px auto" }}>
              <div style={{ width: "375px", height: "3px", backgroundColor: "#C3A85E" }} />
              <span style={{ margin: "0 15px", color: "#535353", fontSize: "25px" }}>e</span>
              <div style={{ width: "375px", height: "3px", backgroundColor: "#C3A85E" }} />
            </div>

            <p style={{ fontSize: "35px", fontWeight: 510, color: "#272727", textAlign: "center", margin: "0 auto 30px auto" }}>
              uma selfie para validação do cadastro
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "22px", width: "760px", margin: "0 auto 40px auto" }}>

              {/* Número do documento */}
              <div>
                <label style={{ fontSize: "28px", fontWeight: 510, color: "#272727", display: "block", marginBottom: "10px" }}>
                  número do documento (RG ou CNH)
                </label>
                <input
                  type="text"
                  placeholder="Digite o número do documento"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  style={{ width: "100%", height: "65px", borderRadius: "40px", border: "2px solid #E0C271", padding: "0 24px", fontSize: "24px", backgroundColor: "#FAF9F5", color: "#272727", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Foto do documento */}
              <div>
                <label style={{ fontSize: "28px", fontWeight: 510, color: "#272727", display: "block", marginBottom: "10px" }}>
                  foto do documento
                </label>
                <div style={{ width: "100%", minHeight: "65px", borderRadius: "40px", border: `2px solid ${showError3 && !documentoFile ? "#D92B2E" : "#E0C271"}`, padding: "14px 24px", backgroundColor: "#FAF9F5", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { setDocumentoFile(e.target.files?.[0] ?? null); setLocalError(""); setShowError3(false); }}
                    style={{ width: "100%", fontSize: "20px", color: "#535353" }}
                  />
                </div>
                {documentoFile && <p style={{ marginTop: "8px", color: "#535353", fontSize: "16px" }}>Selecionado: {documentoFile.name}</p>}
              </div>

              {/* Selfie */}
              <div>
                <label style={{ fontSize: "28px", fontWeight: 510, color: "#272727", display: "block", marginBottom: "10px" }}>
                  selfie do usuário
                </label>
                <div style={{ width: "100%", minHeight: "65px", borderRadius: "40px", border: `2px solid ${showError3 && !selfieFile ? "#D92B2E" : "#E0C271"}`, padding: "14px 24px", backgroundColor: "#FAF9F5", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => { setSelfieFile(e.target.files?.[0] ?? null); setLocalError(""); setShowError3(false); }}
                    style={{ width: "100%", fontSize: "20px", color: "#535353" }}
                  />
                </div>
                {selfieFile && <p style={{ marginTop: "8px", color: "#535353", fontSize: "16px" }}>Selecionado: {selfieFile.name}</p>}
              </div>
            </div>

            <div onClick={goToPreviousSection}
              style={{ position: "fixed", top: "46px", left: "51px", fontSize: "30px", fontWeight: 500, color: "#272727", cursor: "pointer", userSelect: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}>
              ← Voltar
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              className={isSubmitting ? "btn-loading" : ""}
              style={{ display: "flex", backgroundColor: "#E0C271", color: "#FAF9F5", border: "none", borderRadius: "60px", width: "440px", justifyContent: "center", alignItems: "center", height: "80px", fontSize: "52px", fontWeight: 600, cursor: isSubmitting ? "default" : "pointer", transition: "transform 0.2s ease", margin: "0 auto 45px auto" }}
              onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Enviando..." : "Cadastrar-se"}
            </button>

            <div style={{ textAlign: "center", color: "#535353", fontWeight: 500, fontSize: "25px" }}>
              Já tem uma conta?{" "}
              <a href="/login" style={{ color: "#535353", fontWeight: 500, textDecoration: "underline" }}>Entrar</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
