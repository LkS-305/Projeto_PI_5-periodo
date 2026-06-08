"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { TransacaoGateway } from "@/lib/gateways/TransacaoGateway";
import type { IniciarPagamentoResponse, MetodoPagamentoApi } from "@/types/dtos/transacao";

export type PixPayerInfo = {
  user_id: string;
  cpf: string;
  nome: string;
  email: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  servicoId: string;
  valorReais: number;
  payer: PixPayerInfo | null;
  metodo: MetodoPagamentoApi;
  onSucesso?: () => void;
};

function qrSrc(encoded: string | null): string | null {
  if (!encoded) return null;
  if (encoded.startsWith("data:")) return encoded;
  return `data:image/png;base64,${encoded}`;
}

const TITULO: Record<MetodoPagamentoApi, string> = {
  Pix: "Pagamento PIX",
  Boleto: "Pagamento por boleto",
  Credito: "Pagamento — cartão ou outros (Asaas)",
};

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  fontSize: "15px",
  borderRadius: "12px",
  border: "1px solid #EAEAEA",
  padding: "12px 14px",
  background: "#fff",
  color: "#272727",
};

export function PagamentoCheckoutModal({
  open,
  onClose,
  servicoId,
  valorReais,
  payer,
  metodo,
  onSucesso,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resposta, setResposta] = useState<IniciarPagamentoResponse | null>(null);
  const [formCpf, setFormCpf] = useState("");
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResposta(null);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      setFormCpf("");
      setFormNome("");
      setFormEmail("");
      return;
    }
    if (!payer || !servicoId || valorReais <= 0) {
      setError("Dados insuficientes para iniciar o pagamento.");
      return;
    }
    setError(null);
    setResposta(null);
    setFormCpf(payer.cpf || "");
    setFormNome(
      (payer.nome || "").trim() || (payer.email || "").split("@")[0] || "Cliente",
    );
    setFormEmail((payer.email || "").trim());
  }, [open, payer, servicoId, valorReais, reset]);

  const handleGerar = useCallback(async () => {
    if (!payer || !servicoId || valorReais <= 0) return;
    const nome = formNome.trim();
    const email = formEmail.trim();
    if (nome.length < 2) {
      setError("Indica o nome completo do pagador (mínimo 2 caracteres).");
      return;
    }
    if (!EMAIL_OK.test(email)) {
      setError("Indica um e-mail válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResposta(null);
    try {
      const res = await TransacaoGateway.iniciarPagamento({
        servico_id: servicoId,
        user_id: payer.user_id,
        cpf: formCpf,
        nome,
        email,
        valor: valorReais.toFixed(2),
        metodo_pagamento: metodo,
      });
      setResposta(res);
      onSucesso?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível criar a cobrança.");
    } finally {
      setLoading(false);
    }
  }, [payer, servicoId, valorReais, formCpf, formNome, formEmail, metodo, onSucesso]);

  const pix = resposta?.pix;
  const boleto = resposta?.boleto;
  const fatura = resposta?.faturaAsaas;
  const copyPix = pix?.copyPaste ?? "";
  const linhaBoleto = boleto?.identificationField ?? "";

  const handleCopy = async (texto: string, falha: string) => {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      setError(falha);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-titulo"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(39,39,39,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#FAF9F5",
          borderRadius: "24px",
          padding: "28px 24px 24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          fontFamily: "'SF Pro Text', system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <h2 id="checkout-modal-titulo" style={{ margin: 0, fontSize: "22px", color: "#272727" }}>
            {TITULO[metodo]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "22px",
              cursor: "pointer",
              color: "#535353",
              lineHeight: 1,
            }}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "15px", color: "#535353", lineHeight: 1.45 }}>
          Valor:{" "}
          <strong>
            {valorReais.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </strong>
          . Após o Asaas confirmar o pagamento, o estado do serviço é atualizado (no sandbox pode demorar um pouco).
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6f6f6f", lineHeight: 1.45 }}>
          Confirma os dados do pagador abaixo. O CPF não precisa estar no teu perfil — o Asaas pode exigir CPF
          válido para PIX em produção; se falhar, tenta com 11 dígitos.
        </p>

        {resposta ? (
          <>
            {metodo === "Pix" && pix ? (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {qrSrc(pix.qrCodeImage) ? (
                  <div style={{ textAlign: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrSrc(pix.qrCodeImage)!}
                      alt="QR Code PIX"
                      style={{ maxWidth: "100%", width: 260, height: "auto", borderRadius: "12px" }}
                    />
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "14px", color: "#8E8D8C" }}>
                    QR Code não disponível — use o código copia e cola ou o link da fatura.
                  </p>
                )}

                {copyPix ? (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600, color: "#272727" }}>
                      PIX copia e cola
                    </p>
                    <textarea
                      readOnly
                      value={copyPix}
                      rows={4}
                      style={{
                        ...inputStyle,
                        fontSize: "12px",
                        resize: "vertical",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopy(copyPix, "Não foi possível copiar. Selecione o código manualmente.")
                      }
                      style={{
                        marginTop: "10px",
                        padding: "12px 20px",
                        borderRadius: "999px",
                        border: "none",
                        background: "#272727",
                        color: "#FAF9F5",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "15px",
                      }}
                    >
                      Copiar código PIX
                    </button>
                  </div>
                ) : null}

                {pix.invoiceUrl ? (
                  <a
                    href={pix.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "15px",
                      color: "#C3A85E",
                      fontWeight: 600,
                    }}
                  >
                    Abrir fatura no Asaas →
                  </a>
                ) : null}
              </div>
            ) : metodo === "Boleto" && boleto ? (
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {linhaBoleto ? (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 600, color: "#272727" }}>
                      Linha digitável
                    </p>
                    <textarea
                      readOnly
                      value={linhaBoleto}
                      rows={3}
                      style={{
                        ...inputStyle,
                        fontSize: "13px",
                        letterSpacing: "0.02em",
                        resize: "vertical",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        void handleCopy(
                          linhaBoleto.replace(/\D/g, ""),
                          "Não foi possível copiar a linha digitável.",
                        )
                      }
                      style={{
                        marginTop: "10px",
                        padding: "12px 20px",
                        borderRadius: "999px",
                        border: "none",
                        background: "#272727",
                        color: "#FAF9F5",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "15px",
                      }}
                    >
                      Copiar linha digitável
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "14px", color: "#8E8D8C" }}>
                    Linha digitável ainda não disponível — usa o PDF ou a fatura abaixo.
                  </p>
                )}
                {boleto.bankSlipUrl ? (
                  <a
                    href={boleto.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "15px",
                      color: "#C3A85E",
                      fontWeight: 600,
                    }}
                  >
                    Baixar boleto (PDF) →
                  </a>
                ) : null}
                {boleto.invoiceUrl ? (
                  <a
                    href={boleto.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "15px",
                      color: "#C3A85E",
                      fontWeight: 600,
                    }}
                  >
                    Abrir fatura no Asaas →
                  </a>
                ) : null}
              </div>
            ) : metodo === "Credito" && fatura?.invoiceUrl ? (
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <p style={{ margin: 0, fontSize: "15px", color: "#535353", lineHeight: 1.5 }}>
                  Na página do Asaas podes escolher a forma de pagamento disponível na tua conta (por exemplo cartão
                  de crédito, PIX ou boleto).
                </p>
                <a
                  href={fatura.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    padding: "14px 22px",
                    borderRadius: "999px",
                    background: "#272727",
                    color: "#FAF9F5",
                    fontWeight: 700,
                    fontSize: "16px",
                    textDecoration: "none",
                  }}
                >
                  Pagar na página do Asaas
                </a>
              </div>
            ) : (
              <p style={{ marginTop: "24px", color: "#8E8D8C", fontSize: "14px" }}>
                Resposta incompleta da API. Fecha e tenta de novo ou contacta o suporte.
              </p>
            )}
          </>
        ) : loading ? (
          <p style={{ marginTop: "24px", color: "#8E8D8C" }}>A gerar cobrança…</p>
        ) : (
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {error ? (
              <p style={{ margin: 0, color: "#D92B2E", fontSize: "15px", lineHeight: 1.45 }}>{error}</p>
            ) : null}
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", color: "#272727" }}>
              Nome do pagador
              <input
                type="text"
                value={formNome}
                onChange={(e) => {
                  setFormNome(e.target.value);
                  if (error) setError(null);
                }}
                style={inputStyle}
                autoComplete="name"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", color: "#272727" }}>
              E-mail
              <input
                type="email"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                  if (error) setError(null);
                }}
                style={inputStyle}
                autoComplete="email"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", color: "#272727" }}>
              CPF (opcional no formulário; recomendado para PIX)
              <input
                type="text"
                inputMode="numeric"
                value={formCpf}
                onChange={(e) => {
                  const d = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let masked = d;
                  if (d.length > 3) masked = `${d.slice(0, 3)}.${d.slice(3)}`;
                  if (d.length > 6) masked = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
                  if (d.length > 9) masked = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
                  setFormCpf(masked);
                  if (error) setError(null);
                }}
                style={inputStyle}
                autoComplete="off"
                placeholder="000.000.000-00"
              />
            </label>
            <button
              type="button"
              onClick={() => void handleGerar()}
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "14px 22px",
                borderRadius: "999px",
                border: "none",
                background: "#272727",
                color: "#FAF9F5",
                fontWeight: 700,
                fontSize: "16px",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              Gerar cobrança
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
