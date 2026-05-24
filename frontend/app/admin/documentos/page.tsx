"use client";

import { useEffect, useState } from "react";
import {
  DocumentoGateway,
  DocumentoPendente,
} from "@/lib/gateways/DocumentoGateway";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export default function AdminDocumentosPage() {
  const [documentos, setDocumentos] = useState<DocumentoPendente[]>([]);
  const [loading, setLoading] = useState(true);

 async function carregarDocumentos() {
  setLoading(true);

  try {
    const resposta = await DocumentoGateway.listarPendentes();
    setDocumentos(resposta);
  } catch (erro) {
    console.error("Erro ao carregar documentos pendentes:", erro);
    setDocumentos([]);
  } finally {
    setLoading(false);
  }
}

  async function alterarStatus(
    id: string,
    status: "aprovado" | "rejeitado",
  ) {
    await DocumentoGateway.atualizarStatus(id, status);
    await carregarDocumentos();
  }

  useEffect(() => {
    carregarDocumentos();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        padding: "40px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "42px", marginBottom: "30px" }}>
        Validação de documentos
      </h1>

      {loading && <p>Carregando documentos pendentes...</p>}

      {!loading && documentos.length === 0 && (
        <p>Nenhum documento pendente encontrado.</p>
      )}

      <div style={{ display: "grid", gap: "24px" }}>
        {documentos.map((documento) => (
          <section
            key={documento.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "26px", marginBottom: "8px" }}>
              {documento.usuario_nome ?? "Usuário"}
            </h2>

            <p style={{ marginBottom: "8px" }}>
              E-mail: {documento.usuario_email ?? "Não informado"}
            </p>

            <p style={{ marginBottom: "20px" }}>
              Documento: {documento.numero_documento ?? "Não informado"}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                marginBottom: "24px",
              }}
            >
              <div>
                <h3>Foto do documento</h3>
                <img
                  src={`${API_URL}${documento.arquivo_url}`}
                  alt="Documento enviado"
                  style={{
                    width: "100%",
                    maxHeight: "360px",
                    objectFit: "contain",
                    borderRadius: "16px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <div>
                <h3>Selfie</h3>
                <img
                  src={`${API_URL}${documento.selfie_url}`}
                  alt="Selfie enviada"
                  style={{
                    width: "100%",
                    maxHeight: "360px",
                    objectFit: "contain",
                    borderRadius: "16px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={() => alterarStatus(documento.id, "aprovado")}
                style={{
                  backgroundColor: "#22C55E",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "999px",
                  padding: "14px 28px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Aprovar
              </button>

              <button
                onClick={() => alterarStatus(documento.id, "rejeitado")}
                style={{
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "999px",
                  padding: "14px 28px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Rejeitar
              </button>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}