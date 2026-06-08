import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ClientGateway,
  getCurrentUserEmail,
  getCurrentUserId,
} from "@/lib/gateways/ClientGateway";
import { useSession } from "@/lib/contexts/AuthContext";
import type { Endereco } from "@/types/entities/endereco";
import "./personal.css";

type ProfileState = {
  nome: string;
  email: string;
  telefone: string;
  foto_url: string;
};

type PersonalInfo = {
  id: string;
  label: string;
  value: string;
  actionLabel: string;
  helperText: string;
  inputType?: "text" | "email" | "tel" | "url";
  editable?: boolean;
  hideAction?: boolean;
};

function buildRows(profile: ProfileState, enderecoDisplay: string): PersonalInfo[] {
  return [
    {
      id: "1",
      label: "Nome",
      value: profile.nome.trim() || "Não informado",
      actionLabel: "Editar",
      helperText: "Nome como prefere ser apresentado na plataforma.",
    },
    {
      id: "2",
      label: "E-mail da conta",
      value: profile.email.trim() || "Não informado",
      actionLabel: "",
      helperText: "O e-mail de login não pode ser alterado aqui.",
      inputType: "email",
      editable: false,
      hideAction: true,
    },
    {
      id: "3",
      label: "Telefone",
      value: profile.telefone.trim() || "Não informado",
      actionLabel: "Editar",
      helperText: "Formato (DDD) 99999-9999 ou (DDD) 3234-5678.",
      inputType: "tel",
    },
    {
      id: "4",
      label: "Foto do perfil",
      value: profile.foto_url.trim() || "Não informado",
      actionLabel: "Editar",
      helperText:
        "Cole o endereço (URL) de uma imagem. Deixe em branco e salve para remover a foto.",
      inputType: "url",
    },
    {
      id: "5",
      label: "Endereço residencial",
      value: enderecoDisplay || "Não informado",
      actionLabel: "Editar",
      helperText: "Informe o CEP e o número; o restante é preenchido automaticamente.",
    },
  ];
}

const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

const formatBrazilianPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCEP = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatEnderecoDisplay = (e: Endereco | null): string => {
  if (!e) return "";
  const linha1 = [e.logradouro, e.numero].filter(Boolean).join(", ");
  const linha2 = [e.bairro, [e.cidade, e.estado].filter(Boolean).join("/")]
    .filter(Boolean)
    .join(" - ");
  return [linha1, linha2].filter(Boolean).join(" - ");
};

function isValidHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Personal() {
  const { updateUser } = useSession();
  const [profile, setProfile] = useState<ProfileState>({
    nome: "",
    email: "",
    telefone: "",
    foto_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [fieldError, setFieldError] = useState("");

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

  const enderecoDisplay = useMemo(() => formatEnderecoDisplay(enderecoAtual), [enderecoAtual]);

  const personalInfos = useMemo(
    () => buildRows(profile, enderecoDisplay),
    [profile, enderecoDisplay],
  );

  const reloadProfile = useCallback(async () => {
    const userId = getCurrentUserId();
    const email = getCurrentUserEmail() ?? "";

    let nome = "";
    let telefone = "";
    let foto_url = "";

    if (userId) {
      try {
        const usuario = await ClientGateway.getUsuario(userId);
        nome = usuario?.nome ?? "";
        telefone = usuario?.telefone ?? "";
        foto_url = usuario?.foto_url ?? "";
      } catch {
        /* ignora */
      }
    }

    setProfile({ nome, email, telefone, foto_url });
  }, []);

  useEffect(() => {
    const userId = getCurrentUserId();

    async function carregar() {
      await reloadProfile();

      let endereco: Endereco | null = null;
      if (userId) {
        try {
          endereco = await ClientGateway.getEnderecoPrincipal(userId);
        } catch {
          endereco = null;
        }
      }
      setEnderecoAtual(endereco);
      setLoading(false);
    }

    carregar();
  }, [reloadProfile]);

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
    } else if (info.id === "1") {
      setDraftValue(profile.nome);
    } else if (info.id === "3") {
      setDraftValue(profile.telefone ? formatBrazilianPhone(profile.telefone) : "");
    } else if (info.id === "4") {
      setDraftValue(profile.foto_url);
    }
  };

  const validateField = (info: PersonalInfo, value: string) => {
    const trimmedValue = value.trim();
    if (info.id === "4") {
      if (!trimmedValue) return "";
      if (!isValidHttpUrl(trimmedValue)) return "Informe uma URL válida (http ou https).";
      return "";
    }
    if (!trimmedValue) return "Este campo não pode ficar vazio.";
    if (info.inputType === "tel" && !phoneRegex.test(trimmedValue))
      return "Use o formato (DDD) 99999-9999 ou (DDD) 3234-5678.";
    return "";
  };

  const handleSave = async (info: PersonalInfo) => {
    const validationError = validateField(info, draftValue);
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const trimmedValue = draftValue.trim();

    try {
      if (info.id === "1") {
        await ClientGateway.atualizarUsuario({ nome: trimmedValue });
        setProfile((p) => ({ ...p, nome: trimmedValue }));
        await updateUser({ nome: trimmedValue });
      } else if (info.id === "3") {
        await ClientGateway.atualizarUsuario({ telefone: trimmedValue });
        setProfile((p) => ({ ...p, telefone: trimmedValue }));
        await updateUser({ telefone: trimmedValue });
      } else if (info.id === "4") {
        await ClientGateway.atualizarUsuario({ url: trimmedValue || "" });
        setProfile((p) => ({ ...p, foto_url: trimmedValue }));
        await updateUser({ foto_url: trimmedValue });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Não foi possível salvar. Tente novamente.";
      setFieldError(msg);
      return;
    }

    setEditingId(null);
    setDraftValue("");
    setFieldError("");
  };

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

      const novo: Endereco =
        salvo && (salvo as Endereco).logradouro
          ? salvo
          : ({ id: enderecoAtual?.id ?? "", user_id: userId, complemento: "", ...base } as Endereco);

      setEnderecoAtual(novo);
      setEditingId(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Não foi possível salvar o endereço.";
      setFieldError(msg);
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

  const previewSrc = profile.foto_url.trim();
  const showPreview = previewSrc && isValidHttpUrl(previewSrc);

  return (
    <div className="personal-content">
      {showPreview ? (
        <div className="personal-profile-preview">
          <Image
            src={previewSrc}
            alt=""
            width={96}
            height={96}
            className="personal-profile-preview__img"
            unoptimized
          />
          <p className="personal-profile-preview__caption">Pré-visualização da foto do perfil</p>
        </div>
      ) : null}

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
                      {cepResolvido.bairro} — {cepResolvido.cidade}/{cepResolvido.estado}
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
                        : info.inputType === "url"
                          ? "https://…"
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
            {info.hideAction ? (
              <span className="personal-info-item__action personal-info-item__action--muted" />
            ) : (
              <button
                type="button"
                className="personal-info-item__action"
                onClick={() => handleStartEdit(info)}
              >
                {editingId === info.id ? "Cancelar" : info.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
