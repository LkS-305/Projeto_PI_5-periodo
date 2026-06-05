"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/contexts/AuthContext";
import { useServico } from "@/utils/hooks/useServico";
import { MvpShell } from "@/components/MvpShell";
import { Servico } from "@/types/entities/servico";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import { labelServicoStatus } from "@/utils/servicoUi";
import { formatDatePtBR, truncateText } from "@/utils/formatDisplay";

export default function AcordoPage() {
  const router = useRouter();
  const params = useParams();
  const servicoId = params.id as string;
  const { user } = useSession();
  const {
    fetchById,
    proporAcordo,
    aceitarProposta,
    recusarServico,
    loading,
    error,
  } = useServico();

  const [servico, setServico] = useState<Servico | null>(null);
  const [prestadorNome, setPrestadorNome] = useState<string | null>(null);
  const [preco, setPreco] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [duracao, setDuracao] = useState("2h");
  const [localError, setLocalError] = useState<string | null>(null);

  const isPrestador = user?.id === servico?.prestador_id;
  const isCliente = user?.id === servico?.user_id;

  useEffect(() => {
    if (!servicoId) return;
    void fetchById(servicoId).then((s) => {
      if (s) {
        setServico(s);
        if (s.preco_acordado) setPreco(String(s.preco_acordado));
        if (s.data_inicio) {
          const d = new Date(s.data_inicio);
          setDataInicio(d.toISOString().slice(0, 16));
        }
        if (s.duracao) setDuracao(s.duracao);
      }
    });
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

  async function handlePropor(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!preco || !dataInicio) {
      setLocalError("Informe valor e data de início.");
      return;
    }
    const result = await proporAcordo({
      id: servicoId,
      preco_acordado: parseFloat(preco),
      data_inicio: new Date(dataInicio).toISOString(),
      duracao,
    });
    if (result) {
      setServico(result);
      router.push(`/messages?servico=${servicoId}`);
    }
  }

  async function handleAceitar() {
    const ok = await aceitarProposta(servicoId);
    if (ok) router.push(`/servicos/${servicoId}/pagamento`);
  }

  async function handleRecusar() {
    const ok = await recusarServico(servicoId);
    if (ok) router.push("/dashboard");
  }

  const inner = !servico ? (
    <p className="mvp-subtitle">A carregar acordo…</p>
  ) : (
    <>
      <h1 className="mvp-title">Acordo do serviço</h1>
      <p className="mvp-subtitle">{servico.titulo}</p>
      {prestadorNome ? (
        <p
          className="mvp-subtitle"
          style={{ marginTop: "-0.5rem", marginBottom: "0.5rem" }}
        >
          Prestador: <strong>{prestadorNome}</strong>
        </p>
      ) : null}
      <span
        style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          background: "#f5f0e6",
          borderRadius: 999,
          fontSize: "0.85rem",
          marginBottom: "0.75rem",
        }}
      >
        {labelServicoStatus(servico.status)}
      </span>

      <div className="mvp-card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.35rem", fontSize: "0.9rem" }}>
          <strong>Categoria:</strong> {servico.categoria?.trim() ? servico.categoria : "—"}
        </p>
        <p style={{ margin: "0 0 0.35rem", fontSize: "0.9rem" }}>
          <strong>Pedido criado em:</strong> {formatDatePtBR(servico.created_at)}
        </p>
        {servico.descricao?.trim() ? (
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#444", lineHeight: 1.5 }}>
            <strong>Descrição:</strong> {truncateText(servico.descricao, 400)}
          </p>
        ) : null}
      </div>

      {isPrestador && (servico.status === "criado" || servico.status === "pendente") && (
        <form className="mvp-card" onSubmit={handlePropor}>
          <p className="mvp-subtitle" style={{ marginTop: 0 }}>
            Defina valor e data para o cliente aceitar.
          </p>

          <label style={{ display: "block", marginBottom: "0.85rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Valor (R$)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              className="mvp-input"
              style={{ width: "100%", marginTop: "0.35rem" }}
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
            />
          </label>

          <label style={{ display: "block", marginBottom: "0.85rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Data de início</span>
            <input
              type="datetime-local"
              className="mvp-input"
              style={{ width: "100%", marginTop: "0.35rem" }}
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </label>

          <label style={{ display: "block", marginBottom: "1rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Duração</span>
            <select
              className="mvp-select"
              style={{ width: "100%", marginTop: "0.35rem" }}
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
            >
              <option value="1h">1 hora</option>
              <option value="2h">2 horas</option>
              <option value="4h">4 horas</option>
              <option value="8h">8 horas</option>
            </select>
          </label>

          {(localError || error) && (
            <div className="mvp-alert mvp-alert--error">{localError || error}</div>
          )}

          <button
            type="submit"
            className="mvp-btn mvp-btn--gold"
            style={{ width: "100%", padding: "0.85rem" }}
            disabled={loading}
          >
            {loading ? "A enviar…" : "Enviar proposta"}
          </button>
        </form>
      )}

      {isCliente && servico.status === "pendente" && (
        <div className="mvp-card">
          <h2 className="mvp-section-title">Proposta do prestador</h2>
          <p>
            <strong>Valor:</strong> R${" "}
            {Number(servico.preco_acordado ?? 0).toFixed(2)}
          </p>
          <p>
            <strong>Data:</strong>{" "}
            {servico.data_inicio
              ? new Date(servico.data_inicio).toLocaleString("pt-BR")
              : "—"}
          </p>
          <p>
            <strong>Duração:</strong> {servico.duracao ?? "—"}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginTop: "1.25rem",
            }}
          >
            <button
              type="button"
              className="mvp-btn mvp-btn--primary"
              style={{ flex: "1 1 140px", padding: "0.75rem" }}
              onClick={handleAceitar}
              disabled={loading}
            >
              Aceitar
            </button>
            <button
              type="button"
              className="mvp-btn"
              style={{
                flex: "1 1 140px",
                padding: "0.75rem",
                background: "#fdecea",
                borderColor: "#f5c4c1",
              }}
              onClick={handleRecusar}
              disabled={loading}
            >
              Recusar
            </button>
          </div>
        </div>
      )}

      {isCliente && servico.status === "aceito" && (
        <div className="mvp-card" style={{ textAlign: "center" }}>
          <p>Proposta aceita. Realize o pagamento para iniciar o serviço.</p>
          <button
            type="button"
            className="mvp-btn mvp-btn--primary"
            style={{ marginTop: "0.75rem", padding: "0.75rem 1.5rem" }}
            onClick={() => router.push(`/servicos/${servicoId}/pagamento`)}
          >
            Ir para pagamento
          </button>
        </div>
      )}

      {!isPrestador && !isCliente && (
        <div className="mvp-alert mvp-alert--error">
          Não tem permissão para ver este acordo.
        </div>
      )}
    </>
  );

  return (
    <MvpShell backHref={`/messages?servico=${servicoId}`} backLabel="← Chat">
      <main className="mvp-main mvp-main--narrow">{inner}</main>
    </MvpShell>
  );
}
