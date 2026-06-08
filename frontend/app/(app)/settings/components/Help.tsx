"use client";

import { useState } from "react";
import "./help.css";

const FAQ = [
  {
    q: "Como funciona o pagamento?",
    a: "O valor fica retido com segurança pela plataforma e só é liberado ao profissional após a confirmação de que o serviço foi concluído.",
  },
  {
    q: "Como me torno um profissional?",
    a: "Acesse seu perfil e ative o modo profissional. Preencha sua bio, especialidades e monte seu portfólio para começar a receber propostas.",
  },
  {
    q: "Esqueci minha senha. E agora?",
    a: 'Na tela de login, clique em "Esqueceu a senha?" e siga as instruções enviadas para o seu e-mail para redefini-la.',
  },
  {
    q: "Como excluo minha conta?",
    a: 'Em Configurações, vá até a seção "Excluir conta" e confirme. A ação é permanente e remove todos os seus dados.',
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="settings-section-card">
      <h3 className="settings-section-card__title">Ajuda</h3>
      <p className="settings-section-card__text">
        Encontre respostas rápidas para as dúvidas mais frequentes.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
        {FAQ.map((item, index) => {
          const open = openIndex === index;
          return (
            <div
              key={item.q}
              style={{
                border: "1.5px solid #EAEAEA",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'SF Pro Text', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#272727",
                }}
              >
                {item.q}
                <span
                  style={{
                    transform: open ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    fontSize: "22px",
                    color: "#C3A85E",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  +
                </span>
              </button>
              {open && (
                <p
                  style={{
                    margin: 0,
                    padding: "0 20px 16px 20px",
                    fontFamily: "'SF Pro Text', system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    color: "#535353",
                    lineHeight: 1.5,
                  }}
                >
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
