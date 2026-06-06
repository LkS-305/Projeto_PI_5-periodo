"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";
import { ClientGateway } from "@/lib/gateways/ClientGateway";
import "./delete-account.css";

export default function DeleteAccount() {
  const router = useRouter();
  const { logout } = useSession();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");
    try {
      await ClientGateway.deletarUsuarioAtual();
      logout();
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Não foi possível excluir a conta. Tente novamente.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="settings-section-card settings-section-card--danger">
      <h3 className="settings-section-card__title">Excluir conta</h3>
      <p className="settings-section-card__text">
        Esta ação é permanente. Revise seus dados antes de confirmar a exclusão
        da conta.
      </p>
      <button
        type="button"
        className="settings-section-card__danger-btn"
        onClick={() => setShowConfirm(true)}
      >
        Excluir
      </button>

      {showConfirm && (
        <div
          onClick={() => !isDeleting && setShowConfirm(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(39, 39, 39, 0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 90vw)",
              backgroundColor: "#FAF9F5",
              borderRadius: "28px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              padding: "40px",
              boxSizing: "border-box",
              textAlign: "center",
              fontFamily: "'SF Pro Text', system-ui, sans-serif",
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: "28px",
                color: "#272727",
                margin: "0 0 14px 0",
              }}
            >
              Excluir sua conta?
            </h2>
            <p
              style={{
                fontWeight: 400,
                fontSize: "18px",
                color: "#535353",
                lineHeight: 1.5,
                margin: "0 0 28px 0",
              }}
            >
              Esta ação é <b>permanente</b> e não pode ser desfeita. Todos os
              seus dados serão removidos.
            </p>

            {error && (
              <p
                style={{
                  color: "#D92B2E",
                  fontSize: "16px",
                  margin: "0 0 18px 0",
                }}
              >
                {error}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: "14px 28px",
                  borderRadius: "40px",
                  border: "2px solid #272727",
                  backgroundColor: "transparent",
                  color: "#272727",
                  fontSize: "18px",
                  fontWeight: 500,
                  cursor: isDeleting ? "default" : "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                style={{
                  padding: "14px 28px",
                  borderRadius: "40px",
                  border: "none",
                  backgroundColor: "#D92B2E",
                  color: "#FAF9F5",
                  fontSize: "18px",
                  fontWeight: 600,
                  cursor: isDeleting ? "default" : "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
