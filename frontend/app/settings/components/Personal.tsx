import { useState } from "react";
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

const initialPersonalInfos: PersonalInfo[] = [
  {
    id: "1",
    label: "Nome regular",
    value: "Karla J.",
    actionLabel: "Editar",
    helperText: "Use seu nome como aparece em documentos oficiais.",
  },
  {
    id: "2",
    label: "Endereço de email",
    value: "karla.java@gmail.com",
    actionLabel: "Editar",
    helperText: "Use um endereço ao qual você sempre terá acesso.",
    inputType: "email",
  },
  {
    id: "3",
    label: "Números de telefone",
    value: "(11) 98765-5238",
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
    value: "Fornecido",
    actionLabel: "Editar",
    helperText: "Confirme seu endereço residencial completo.",
  },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

const formatBrazilianPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const maskEmail = (email: string) => {
  const [localPart, domainPart] = email.split("@");

  if (!localPart || !domainPart) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] || ""}***@${domainPart}`;
  }

  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domainPart}`;
};

const maskPhone = (phone: string) => {
  const phoneMatch = phone.match(/^\((\d{2})\)\s(\d{5})-(\d{4})$/);

  if (!phoneMatch) {
    return phone;
  }

  return `(**) *****-${phoneMatch[3]}`;
};

const toDisplayValue = (info: PersonalInfo, rawValue: string) => {
  if (info.id === "2") {
    return maskEmail(rawValue);
  }

  if (info.id === "3") {
    return maskPhone(rawValue);
  }

  if (info.id === "5") {
    return "Fornecido";
  }

  return rawValue;
};

export default function Personal() {
  const [personalInfos, setPersonalInfos] = useState(() =>
    initialPersonalInfos.map((info) => ({
      ...info,
      value: toDisplayValue(info, info.value),
    })),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [fieldError, setFieldError] = useState("");

  const startsBlankOnEdit = (id: string) =>
    id === "2" || id === "3" || id === "5";

  const handleStartEdit = (info: PersonalInfo) => {
    if (info.editable === false) {
      return;
    }

    if (editingId === info.id) {
      setEditingId(null);
      setDraftValue("");
      setFieldError("");
      return;
    }

    setEditingId(info.id);
    setDraftValue(startsBlankOnEdit(info.id) ? "" : info.value);
    setFieldError("");
  };

  const validateField = (info: PersonalInfo, value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "Este campo não pode ficar vazio.";
    }

    if (info.inputType === "email" && !emailRegex.test(trimmedValue)) {
      return "Informe um endereço de email válido.";
    }

    if (info.inputType === "tel" && !phoneRegex.test(trimmedValue)) {
      return "Use o formato (19) 99999-9999.";
    }

    return "";
  };

  const handleSave = (info: PersonalInfo) => {
    const validationError = validateField(info, draftValue);

    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const trimmedValue = draftValue.trim();
    const nextDisplayValue = toDisplayValue(info, trimmedValue);

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

  return (
    <div className="personal-content">
      <div className="personal-content__list">
        {personalInfos.map((info) => (
          <div key={info.id} className="personal-info-item">
            <div className="personal-info-item__text">
              <h3 className="personal-info-item__label">{info.label}</h3>
              <p className="personal-info-item__value">{info.value}</p>

              {editingId === info.id ? (
                <div className="personal-info-editor">
                  <p className="personal-info-editor__helper">
                    {info.helperText}
                  </p>
                  <input
                    type={info.inputType || "text"}
                    value={draftValue}
                    onChange={(event) => {
                      const nextValue =
                        info.inputType === "tel"
                          ? formatBrazilianPhone(event.target.value)
                          : event.target.value;

                      setDraftValue(nextValue);
                      if (fieldError) {
                        setFieldError("");
                      }
                    }} //Easter egg: "Camila" hihihi
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
