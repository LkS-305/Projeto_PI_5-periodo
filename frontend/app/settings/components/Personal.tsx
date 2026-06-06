import { useEffect, useState } from "react";
import {
  ClientGateway,
  getCurrentUserEmail,
  getCurrentUserId,
} from "@/lib/gateways/ClientGateway";
import type { Endereco } from "@/types/entities/endereco";
import "./personal.css";

type PersonalInfo = {
  id: string;
  label: string;
  value: string;
  actionLabel: string;
  helperText: string;
  inputType?: "text" | "email" | "tel";
  editable?: boolean;
};

const buildPersonalInfos = (
  nome: string,
  email: string,
  telefone: string,
  enderecoDisplay: string,
): PersonalInfo[] => [
  {
    id: "1",
    label: "Nome regular",
    value: nome || "Não informado",
    actionLabel: "Editar",
    helperText: "Use seu nome como aparece em documentos oficiais.",
  },
  {
    id: "2",
    label: "Endereço de email",
    value: email || "Não informado",
    actionLabel: "Editar",
    helperText: "Use um endereço ao qual você sempre terá acesso.",
    inputType: "email",
    editable: false,
  },
  {
    id: "3",
    label: "Números de telefone",
    value: telefone || "Não informado",
    actionLabel: "Editar/Adicionar",
    helperText: "Use o formato (99) 99999-9999.",
    inputType: "tel",
  },
  {
    id: "4",
    label: "Verificação de identidade",
    value: "Não realizado",
    actionLabel: "Iniciar",
    helperText: "A validação de identidade será liberada em breve.",
    editable: false,
  },
  {
    id: "5",
    label: "Endereço residencial",
    value: enderecoDisplay || "Não informado",
    actionLabel: "Editar",
    helperText: "Informe o CEP e o número; o restante é preenchido automaticamente.",
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

const formatBrazilianPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const maskEmail = (email: string) => {
  const [localPart, domainPart] = email.split("@");
  if (!localPart || !domainPart) return email;
  if (localPart.length <= 2) return `${localPart[0] || ""}***@${domainPart}`;
  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domainPart}`;
};

const maskPhone = (phone: string) => {
  const phoneMatch = phone.match(/^\((\d{2})\)\s(\d{5})-(\d{4})$/);
  if (!phoneMatch) return phone;
  return `(**) *****-${phoneMatch[3]}`;
};

const toDisplayValue = (info: PersonalInfo, rawValue: string) => {
  if (info.id === "2") return maskEmail(rawValue);
  if (info.id === "3") return maskPhone(rawValue);
  return rawValue;
};

const formatEnderecoDisplay = (e: Endereco | null): string => {
  if (!e) return "";
  const linha1 = [e.logradouro, e.numero].filter(Boolean).join(", ");
  const linha2 = [e.bairro, [e.cidade, e.estado].filter(Boolean).join("/")]
    .filter(Boolean)
    .join(" - ");
  return [linha1, linha2].filter(Boolean).join(" - ");
};

export default function Personal() {
  const [personalInfos, setPersonalInfos] = useState<PersonalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [fieldError, setFieldError] = useState("");

  // Estado específico do editor de endereço
  const [enderecoAtual, setEnderecoAtual] = useState<Endereco | null>(null);
  const [cepDraft, setCepDraft] = useState("");
  const [numeroDraft, setNumeroDraft] = useState("");
  const [cepResolvido, setCepResolvido] = useState<{
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
  } | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [savingEndereco, setSavingEndereco] = useState(false);

  useEffect(() => {
    const userId = getCurrentUserId();
    const email = getCurrentUserEmail() ?? "";

    async function carregar() {
      let nome = "";
      let telefone = "";
      let endereco: Endereco | null = null;

      if (userId) {
        try {
          const usuario = await ClientGateway.getUsuario(userId);
          nome = usuario?.nome ?? "";
          telefone = usuario?.telefone ?? "";
        } catch {
          /* ignora */
        }
        try {
          endereco = await ClientGateway.getEnderecoPrincipal(userId);
        } catch {
          endereco = null;
        }
      }

      setEnderecoAtual(endereco);
      setPersonalInfos(
        buildPersonalInfos(nome, email, telefone, formatEnderecoDisplay(endereco)).map(
          (info) => ({ ...info, value: toDisplayValue(info, info.value) }),
        ),
      );
      setLoading(false);
    }

    carregar();
  }, []);

  const startsBlankOnEdit = (id: string) => id === "2" || id === "3";

  const handleStartEdit = (info: PersonalInfo) => {
    if (info.editable === false) return;

    if (editingId === info.id) {
      setEditingId(null);
      setDraftValue("");
      setFieldError("");
      return;
    }

    setEditingId(info.id);
    setFieldError("");

    if (info.id === "5") {
      // Prefill com o endereço atual, se houver
      setCepDraft(enderecoAtual?.cep ? formatCEP(enderecoAtual.cep) : "");
      setNumeroDraft(enderecoAtual?.numero ?? "");
      setCepResolvido(
        enderecoAtual
          ? {
              logradouro: enderecoAtual.logradouro,
              bairro: enderecoAtual.bairro,
              cidade: enderecoAtual.cidade,
              estado: enderecoAtual.estado,
            }
          : null,
      );
    } else {
      setDraftValue(startsBlankOnEdit(info.id) ? "" : info.value);
    }
  };

  const validateField = (info: PersonalInfo, value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return "Este campo não pode ficar vazio.";
    if (info.inputType === "email" && !emailRegex.test(trimmedValue))
      return "Informe um endereço de email válido.";
    if (info.inputType === "tel" && !phoneRegex.test(trimmedValue))
      return "Use o formato (19) 99999-9999.";
    return "";
  };

  const handleSave = async (info: PersonalInfo) => {
    const validationError = validateField(info, draftValue);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const trimmedValue = draftValue.trim();
    const nextDisplayValue = toDisplayValue(info, trimmedValue);

    try {
      if (info.id === "1") {
        await ClientGateway.atualizarUsuario({ nome: trimmedValue });
      } else if (info.id === "3") {
        await ClientGateway.atualizarUsuario({ telefone: trimmedValue });
      }
    } catch (err: any) {
      setFieldError(err?.message || "Não foi possível salvar. Tente novamente.");
      return;
    }

    setPersonalInfos((currentInfos) =>
      currentInfos.map((currentInfo) =>
        currentInfo.id === info.id
          ? { ...currentInfo, value: nextDisplayValue }
          : currentInfo,
      ),
    );
    setEditingId(null);
    setDraftValue("");
    setFieldError("");
  };

  // ── Endereço: busca de CEP ───────────────────────────────────────────────
  const handleCepChange = async (value: string) => {
    const masked = formatCEP(value);
    setCepDraft(masked);
    setFieldError("");

    const digits = masked.replace(/\D/g, "");
    if (digits.length === 8) {
      setCepLoading(true);
      try {
        const data = await ClientGateway.buscarCep(digits);
        if (data?.erro) {
          setFieldError("CEP não encontrado.");
          setCepResolvido(null);
        } else {
          setCepResolvido({
            logradouro: data.logradouro ?? "",
            bairro: data.bairro ?? "",
            cidade: data.localidade ?? "",
            estado: data.uf ?? "",
          });
        }
      } catch {
        setFieldError("Não foi possível consultar o CEP.");
        setCepResolvido(null);
      } finally {
        setCepLoading(false);
      }
    } else {
      setCepResolvido(null);
    }
  };

  const handleSaveEndereco = async () => {
    const cepDigits = cepDraft.replace(/\D/g, "");
    if (cepDigits.length !== 8) {
      setFieldError("Informe um CEP válido (8 dígitos).");
      return;
    }
    if (!numeroDraft.trim()) {
      setFieldError("Informe o número do endereço.");
      return;
    }
    if (!cepResolvido) {
      setFieldError("Aguarde a consulta do CEP.");
      return;
    }

    setSavingEndereco(true);
    setFieldError("");

    const userId = getCurrentUserId() ?? "";
    const base = {
      rotulo: enderecoAtual?.rotulo || "Casa",
      logradouro: cepResolvido.logradouro,
      numero: numeroDraft.trim(),
      bairro: cepResolvido.bairro,
      cidade: cepResolvido.cidade,
      estado: cepResolvido.estado,
      cep: cepDigits,
      is_principal: true,
    };

    try {
      let salvo: Endereco;
      if (enderecoAtual) {
        salvo = await ClientGateway.atualizarEndereco(enderecoAtual.id, {
          id: enderecoAtual.id,
          ...base,
        });
      } else {
        salvo = await ClientGateway.criarEndereco({ user_id: userId, ...base });
      }

      // o backend pode retornar o registro salvo; se não, montamos localmente
      const novo: Endereco =
        salvo && (salvo as Endereco).logradouro
          ? salvo
          : ({ id: enderecoAtual?.id ?? "", user_id: userId, complemento: "", ...base } as Endereco);

      setEnderecoAtual(novo);
      setPersonalInfos((current) =>
        current.map((info) =>
          info.id === "5"
            ? { ...info, value: formatEnderecoDisplay(novo) || "Não informado" }
            : info,
        ),
      );
      setEditingId(null);
    } catch (err: any) {
      setFieldError(err?.message || "Não foi possível salvar o endereço.");
    } finally {
      setSavingEndereco(false);
    }
  };

  if (loading) {
    return (
      <div className="personal-content">
        <p style={{ color: "#8E8D8C", fontSize: "18px", padding: "12px" }}>
          Carregando informações...
        </p>
      </div>
    );
  }

  return (
    <div className="personal-content">
      <div className="personal-content__list">
        {personalInfos.map((info) => (
          <div key={info.id} className="personal-info-item">
            <div className="personal-info-item__text">
              <h3 className="personal-info-item__label">{info.label}</h3>
              <p className="personal-info-item__value">{info.value}</p>

              {editingId === info.id && info.id === "5" ? (
                <div className="personal-info-editor">
                  <p className="personal-info-editor__helper">{info.helperText}</p>
                  <input
                    type="text"
                    value={cepDraft}
                    onChange={(e) => handleCepChange(e.target.value)}
                    inputMode="numeric"
                    placeholder="CEP (00000-000)"
                    className="personal-info-editor__input"
                  />
                  <input
                    type="text"
                    value={numeroDraft}
                    onChange={(e) => {
                      setNumeroDraft(e.target.value.replace(/\D/g, "").slice(0, 10));
                      if (fieldError) setFieldError("");
                    }}
                    inputMode="numeric"
                    placeholder="Número"
                    className="personal-info-editor__input"
                    style={{ marginTop: "10px" }}
                  />
                  {cepLoading && (
                    <p className="personal-info-editor__helper">Consultando CEP...</p>
                  )}
                  {cepResolvido && (
                    <p className="personal-info-editor__helper">
                      {cepResolvido.logradouro
                        ? `${cepResolvido.logradouro}, `
                        : ""}
                      {cepResolvido.bairro} — {cepResolvido.cidade}/
                      {cepResolvido.estado}
                    </p>
                  )}
                  {fieldError ? (
                    <p className="personal-info-editor__error">{fieldError}</p>
                  ) : null}
                  <button
                    type="button"
                    className="personal-info-editor__save"
                    onClick={handleSaveEndereco}
                    disabled={savingEndereco}
                  >
                    {savingEndereco ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              ) : editingId === info.id ? (
                <div className="personal-info-editor">
                  <p className="personal-info-editor__helper">{info.helperText}</p>
                  <input
                    type={info.inputType || "text"}
                    value={draftValue}
                    onChange={(event) => {
                      const nextValue =
                        info.inputType === "tel"
                          ? formatBrazilianPhone(event.target.value)
                          : event.target.value;
                      setDraftValue(nextValue);
                      if (fieldError) setFieldError("");
                    }}
                    inputMode={info.inputType === "tel" ? "numeric" : undefined}
                    placeholder={
                      info.inputType === "tel"
                        ? "(99) 99999-9999"
                        : info.inputType === "email"
                          ? "nome@email.com"
                          : undefined
                    }
                    className="personal-info-editor__input"
                  />
                  {fieldError ? (
                    <p className="personal-info-editor__error">{fieldError}</p>
                  ) : null}
                  <button
                    type="button"
                    className="personal-info-editor__save"
                    onClick={() => handleSave(info)}
                  >
                    Salvar
                  </button>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="personal-info-item__action"
              onClick={() => handleStartEdit(info)}
            >
              {info.editable === false
                ? info.actionLabel
                : editingId === info.id
                  ? "Cancelar"
                  : info.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
