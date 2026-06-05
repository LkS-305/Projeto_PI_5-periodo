"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/contexts/AuthContext";
import { usePagamento } from "@/utils/hooks/usePagamento";
import { useServico } from "@/utils/hooks/useServico";
import { MvpShell } from "@/components/MvpShell";
import { Servico } from "@/types/entities/servico";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import { labelServicoStatus } from "@/utils/servicoUi";
import { formatDateTimePtBR } from "@/utils/formatDisplay";

export default function PagamentoPage() {
  const router = useRouter();
  const params = useParams();
  const servicoId = params.id as string;
  const { user } = useSession();
  const { fetchById } = useServico();
  const { iniciarPagamento, simularPagamentoConfirmado, loading, error } =
    usePagamento();

  const [servico, setServico] = useState<Servico | null>(null);
  const [prestadorNome, setPrestadorNome] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [copyPaste, setCopyPaste] = useState<string | null>(null);
  const [metodo, setMetodo] = useState<"Pix" | "Credito" | "Boleto">("Pix");
  const [pago, setPago] = useState(false);

  useEffect(() => {
    if (!servicoId) return;
    void fetchById(servicoId).then(setServico);
  }, [servicoId, fetchById]);

  useEffect(() => {
    const pid = servico?.prestador_id;
    let cancelled = false;
    void (async () => {
      if (!pid) {
        setPrestadorNome(null);
        return;
      }
      try {
        const p = await PrestadorGateway.getByUserId(pid);
        if (!cancelled) setPrestadorNome(p?.nome ?? null);
      } catch {
        if (!cancelled) setPrestadorNome(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [servico?.prestador_id]);

  async function handlePagar() {
    if (!servico || !user) return;

    if (metodo !== "Pix") {
      alert("Na demo apenas Pix está integrado à API.");
      return;
    }

    const response = await iniciarPagamento({
      servico_id: servicoId,
      user_id: user.id,
      cpf: user.cpf ?? "00000000000",
      nome: user.email.split("@")[0],
      email: user.email,
      valor: String(servico.preco_acordado ?? 0),
      metodo_pagamento: "Pix",
    });

    if (response?.pix) {
      setQrImage(response.pix.qrCodeImage);
      setCopyPaste(response.pix.copyPaste);
    }
  }

  async function handleSimular() {
    const ok = await simularPagamentoConfirmado(servicoId);
    if (ok) {
      setPago(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  }

  if (!servico) {
    return (
      <MvpShell backHref="/dashboard">
        <main className="mvp-main mvp-main--narrow">
          <p className="mvp-subtitle">A carregar…</p>
        </main>
      </MvpShell>
    );
  }

  if (servico.status === "emAndamento" || pago) {
    return (
      <MvpShell backHref="/dashboard">
        <main className="mvp-main mvp-main--narrow" style={{ textAlign: "center" }}>
          <h1 className="mvp-title" style={{ color: "var(--mvp-accent)" }}>
            Pagamento confirmado
          </h1>
          <p className="mvp-subtitle">A redirecionar para o dashboard…</p>
        </main>
      </MvpShell>
    );
  }

  return (
    <MvpShell
      backHref={`/servicos/${servicoId}/acordo`}
      backLabel="← Acordo"
    >
      <main className="mvp-main mvp-main--narrow">
        <h1 className="mvp-title">Pagamento</h1>
        <p className="mvp-subtitle">{servico.titulo}</p>
        {prestadorNome ? (
          <p className="mvp-subtitle" style={{ marginTop: "-0.35rem" }}>
            Prestador: <strong>{prestadorNome}</strong>
          </p>
        ) : null}

        <div className="mvp-card" style={{ marginBottom: "1rem" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
            R$ {Number(servico.preco_acordado ?? 0).toFixed(2)}
          </p>
          <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#444" }}>
            <strong>Estado:</strong> {labelServicoStatus(servico.status)}
          </p>
          {servico.categoria?.trim() ? (
            <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#444" }}>
              <strong>Categoria:</strong> {servico.categoria}
            </p>
          ) : null}
          {servico.data_inicio ? (
            <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#444" }}>
              <strong>Início previsto:</strong>{" "}
              {formatDateTimePtBR(servico.data_inicio)}
            </p>
          ) : null}
          {servico.duracao ? (
            <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#444" }}>
              <strong>Duração:</strong> {servico.duracao}
            </p>
          ) : null}
          <p style={{ margin: "0.75rem 0 0", fontSize: "0.85rem" }}>
            <Link href={`/servicos/${servicoId}/acordo`} className="mvp-nav-link" prefetch={false}>
              Rever detalhes do acordo
            </Link>
          </p>
        </div>

        <div
          className="mvp-filters"
          style={{ marginBottom: "1rem", flexWrap: "nowrap" }}
        >
          {(["Pix", "Credito", "Boleto"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className="mvp-btn"
              style={{
                flex: 1,
                borderColor: metodo === m ? "var(--mvp-accent)" : undefined,
                background: metodo === m ? "#e8f5e9" : undefined,
                fontWeight: metodo === m ? 700 : 500,
              }}
              onClick={() => setMetodo(m)}
            >
              {m === "Pix" ? "Pix" : m === "Credito" ? "Cartão" : "Boleto"}
            </button>
          ))}
        </div>

        {metodo === "Pix" && !qrImage && (
          <button
            type="button"
            className="mvp-btn mvp-btn--primary"
            style={{ width: "100%", padding: "0.85rem", marginBottom: "1rem" }}
            onClick={handlePagar}
            disabled={loading}
          >
            {loading ? "A gerar Pix…" : "Gerar QR Code Pix"}
          </button>
        )}

        {qrImage && (
          <div className="mvp-card" style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Image
              src={`data:image/png;base64,${qrImage}`}
              alt="QR Code Pix"
              width={200}
              height={200}
              style={{ margin: "0 auto", maxWidth: "100%", height: "auto" }}
            />
            {copyPaste ? (
              <p
                style={{
                  fontSize: "0.75rem",
                  wordBreak: "break-all",
                  marginTop: "0.75rem",
                  color: "var(--mvp-muted)",
                }}
              >
                {copyPaste}
              </p>
            ) : null}
          </div>
        )}

        {error && (
          <div className="mvp-alert mvp-alert--error" role="alert">
            {error}
          </div>
        )}

        <button
          type="button"
          className="mvp-btn mvp-btn--ghost"
          style={{
            width: "100%",
            padding: "0.65rem",
            borderStyle: "dashed",
            borderColor: "var(--mvp-gold)",
            fontSize: "0.85rem",
          }}
          onClick={handleSimular}
          disabled={loading}
        >
          [Demo] Simular pagamento confirmado
        </button>
      </main>
    </MvpShell>
  );
}
