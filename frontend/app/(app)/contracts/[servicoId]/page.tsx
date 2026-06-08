"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClientGateway,
  getCurrentUserId,
} from "@/lib/gateways/ClientGateway";
import { AvaliacaoGateway } from "@/lib/gateways/AvaliacaoGateway";
import type { Avaliacao } from "@/types/entities/avaliacao";
import type { Servico, ServicoStatus } from "@/types/entities/servico";
import { messagesWithServico, ROUTES } from "@/lib/routes";
import { TransacaoGateway } from "@/lib/gateways/TransacaoGateway";
import type { Transacao } from "@/types/entities/transacao";
import { parseServicoStatus } from "@/lib/utils/servicoUi";
import { RatingStars } from "@/app/(app)/contracts/contractShared";

function formatMoney(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatWhen(raw: Date | string | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const statusLabel: Record<string, string> = {
  criado: "Pedido criado",
  pendente: "Aguardando resposta",
  aceito: "Aceito",
  emAndamento: "Em andamento",
  recusado: "Recusado",
  cancelado: "Cancelado",
  finalizado: "Finalizado",
};

function parseNota(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const servicoId = typeof params?.servicoId === "string" ? params.servicoId : "";

  const [servico, setServico] = useState<Servico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [prestadorNome, setPrestadorNome] = useState<string>("");
  const [clienteNome, setClienteNome] = useState<string>("");
  const [avaliacoesServico, setAvaliacoesServico] = useState<Avaliacao[]>([]);
  const [transacaoServico, setTransacaoServico] = useState<Transacao | null>(null);

  const userId = getCurrentUserId();

  const load = useCallback(async () => {
    if (!servicoId) {
      setError("Identificador do contrato inválido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const s = await ClientGateway.getServicoById(servicoId);
      if (!s) {
        setError("Contrato não encontrado.");
        setServico(null);
        setAvaliacoesServico([]);
        setTransacaoServico(null);
        return;
      }
      setServico(s);

      const [p, u, avRaw] = await Promise.all([
        ClientGateway.getPrestador(s.prestador_id).catch(() => null),
        ClientGateway.getUsuario(s.user_id).catch(() => null),
        AvaliacaoGateway.getByServico(servicoId).catch(() => null),
      ]);
      if (p?.nome) setPrestadorNome(p.nome);
      if (u?.nome) setClienteNome(u.nome);
      setAvaliacoesServico(Array.isArray(avRaw) ? avRaw : []);

      void TransacaoGateway.getByServicoId(servicoId)
        .then((tx) => setTransacaoServico(tx))
        .catch(() => setTransacaoServico(null));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar contrato.");
      setServico(null);
      setAvaliacoesServico([]);
      setTransacaoServico(null);
    } finally {
      setLoading(false);
    }
  }, [servicoId]);

  useEffect(() => {
    void load();
  }, [load]);

  const isParticipant =
    !!userId &&
    !!servico &&
    (servico.user_id === userId || servico.prestador_id === userId);

  const isPrestador = !!userId && !!servico && servico.prestador_id === userId;
  const isCliente = !!userId && !!servico && servico.user_id === userId;

  const statusParsed = servico ? parseServicoStatus(servico.status as string) : null;

  const txPendente = transacaoServico?.status === "pendente";
  const txPago =
    transacaoServico?.status === "aprovada" || transacaoServico?.status === "concluido";

  const resumoAvaliacoes = useMemo(() => {
    if (!servico) return null;
    const avUsuario = avaliacoesServico.find((a) => a.destinatario === "usuario");
    const avPrestador = avaliacoesServico.find((a) => a.destinatario === "prestador");
    const avServico = avaliacoesServico.find((a) => a.destinatario === "servico");
    const notaContratante =
      parseNota(servico.nota_usuario) ?? parseNota(avUsuario?.nota);
    const notaProfissional =
      parseNota(servico.nota_prestador) ?? parseNota(avPrestador?.nota);
    const legacy =
      parseNota(servico.nota) ??
      parseNota(avServico?.nota);
    return {
      notaContratante,
      notaProfissional,
      comentContratante: avUsuario?.comentario?.trim() || undefined,
      comentProfissional: avPrestador?.comentario?.trim() || undefined,
      comentServico: avServico?.comentario?.trim() || undefined,
      legacy,
    };
  }, [servico, avaliacoesServico]);

  const showOnlyLegacy =
    !!resumoAvaliacoes &&
    resumoAvaliacoes.legacy !== undefined &&
    resumoAvaliacoes.notaContratante === undefined &&
    resumoAvaliacoes.notaProfissional === undefined;

  const podeResponder =
    isPrestador &&
    statusParsed !== null &&
    (statusParsed === "criado" || statusParsed === "pendente");

  /** Prestador pode concluir o trabalho após aceitar / estar em execução. */
  const podeFinalizarPrestador =
    isPrestador &&
    statusParsed !== null &&
    (statusParsed === "aceito" || statusParsed === "emAndamento");

  const handleStatus = async (novo: ServicoStatus) => {
    if (!servico) return;
    setActing(true);
    setError(null);
    try {
      await ClientGateway.updateServicoStatus(servico.id, novo);
      await load();
      if (novo === "aceito") {
        router.push(
          `${ROUTES.dashboard}?papel=prestador&contratoAtivo=${encodeURIComponent(servico.id)}`,
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível atualizar.");
    } finally {
      setActing(false);
    }
  };

  const SF: React.CSSProperties = {
    fontFamily: "'SF Pro Text', system-ui, sans-serif",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF9F5",
        padding: "48px 105px 80px",
        fontFamily: "'SF Pro Text', system-ui, sans-serif",
      }}
    >
      <button
        type="button"
        onClick={() => router.push(ROUTES.contracts)}
        style={{
          ...SF,
          border: "none",
          background: "none",
          fontSize: "26px",
          color: "#535353",
          cursor: "pointer",
          marginBottom: "28px",
        }}
      >
        ← Voltar aos contratos
      </button>

      {loading ? (
        <p style={{ ...SF, fontSize: "28px", color: "#8E8D8C" }}>A carregar…</p>
      ) : error && !servico ? (
        <div style={{ maxWidth: "560px" }}>
          <p style={{ ...SF, fontSize: "28px", color: "#D92B2E" }}>{error}</p>
          <Link
            href={ROUTES.contracts}
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "14px 28px",
              borderRadius: "30px",
              background: "#272727",
              color: "#FAF9F5",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Ir para contratos
          </Link>
        </div>
      ) : servico ? (
        <>
          {!isParticipant && userId ? (
            <p style={{ ...SF, color: "#D92B2E", fontSize: "22px" }}>
              Não tens permissão para ver este contrato.
            </p>
          ) : null}

          <div
            style={{
              maxWidth: "820px",
              borderRadius: "36px",
              border: "2px solid #EAEAEA",
              background: "#fff",
              padding: "40px 44px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              <div>
                <span
                  style={{
                    ...SF,
                    display: "inline-block",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    background: "rgba(224,194,113,0.15)",
                    border: "1px solid #E0C271",
                    color: "#C3A85E",
                    fontWeight: 600,
                    fontSize: "20px",
                    marginBottom: "12px",
                  }}
                >
                  {servico.categoria || "Serviço"}
                </span>
                <h1
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontSize: "48px",
                    color: "#272727",
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {servico.titulo}
                </h1>
              </div>
              <span
                style={{
                  ...SF,
                  padding: "10px 18px",
                  borderRadius: "24px",
                  background: "#F4F4F4",
                  fontWeight: 600,
                  fontSize: "20px",
                  color: "#272727",
                }}
              >
                {statusLabel[servico.status] ?? servico.status}
              </span>
            </div>

            <p style={{ ...SF, fontSize: "22px", color: "#535353", lineHeight: 1.6 }}>
              {servico.descricao?.trim() || "Sem descrição."}
            </p>

            <div
              style={{
                marginTop: "28px",
                display: "grid",
                gap: "14px",
                fontSize: "22px",
                color: "#535353",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>Valor:</strong> {formatMoney(Number(servico.preco_acordado ?? 0))}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Início combinado:</strong> {formatWhen(servico.data_inicio)}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Duração:</strong> {servico.duracao || "—"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Cliente:</strong> {clienteNome || servico.user_id}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Prestador:</strong> {prestadorNome || servico.prestador_id}
              </p>
            </div>

            {isCliente &&
            Number(servico.preco_acordado) > 0 &&
            statusParsed !== "finalizado" &&
            statusParsed !== "cancelado" &&
            statusParsed !== "recusado" ? (
              <div
                style={{
                  marginTop: "24px",
                  padding: "20px 22px",
                  borderRadius: "20px",
                  background: "rgba(61, 189, 125, 0.1)",
                  border: "1px solid rgba(61, 189, 125, 0.45)",
                }}
              >
                <p style={{ ...SF, margin: "0 0 10px", fontSize: "22px", fontWeight: 700, color: "#1a6b45" }}>
                  Pagamento do serviço
                </p>
                {txPago ? (
                  <p style={{ ...SF, margin: 0, fontSize: "19px", color: "#535353" }}>
                    Pagamento já registado neste contrato.
                  </p>
                ) : txPendente ? (
                  <p style={{ ...SF, margin: 0, fontSize: "19px", color: "#535353" }}>
                    Há um pagamento em análise no Asaas. Aguarda a confirmação ou abre{" "}
                    <Link href={messagesWithServico(servico.id)} style={{ color: "#C3A85E", fontWeight: 600 }}>
                      Mensagens
                    </Link>{" "}
                    para ver o estado.
                  </p>
                ) : statusParsed === "aceito" || statusParsed === "emAndamento" ? (
                  <>
                    <p style={{ ...SF, margin: "0 0 14px", fontSize: "19px", color: "#535353", lineHeight: 1.5 }}>
                      O botão <strong>Pagar serviço</strong> fica em <strong>Mensagens</strong>, na faixa acima do
                      campo de texto (escolhe PIX, boleto ou cartão/outros).
                    </p>
                    <Link
                      href={messagesWithServico(servico.id)}
                      style={{
                        ...SF,
                        display: "inline-block",
                        padding: "14px 28px",
                        borderRadius: "30px",
                        background: "#3dbd7d",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: "22px",
                      }}
                    >
                      Ir pagar em Mensagens →
                    </Link>
                  </>
                ) : (
                  <p style={{ ...SF, margin: 0, fontSize: "19px", color: "#535353", lineHeight: 1.5 }}>
                    Quando o prestador <strong>aceitar</strong> o contrato, o pagamento fica disponível na conversa em{" "}
                    <Link href={messagesWithServico(servico.id)} style={{ color: "#C3A85E", fontWeight: 600 }}>
                      Mensagens
                    </Link>
                    . Estado atual: <strong>{statusLabel[servico.status] ?? servico.status}</strong>.
                  </p>
                )}
              </div>
            ) : null}

            {isParticipant && resumoAvaliacoes ? (
              <div
                style={{
                  marginTop: "32px",
                  paddingTop: "28px",
                  borderTop: "1.5px solid #EAEAEA",
                }}
              >
                <p style={{ ...SF, fontSize: "24px", fontWeight: 700, color: "#272727", margin: "0 0 8px 0" }}>
                  Avaliações entre as partes
                </p>
                <p style={{ ...SF, fontSize: "18px", color: "#8E8D8C", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                  Nota que cada parte recebeu da outra, quando já existir registo no sistema.
                </p>

                {showOnlyLegacy ? (
                  <div
                    style={{
                      padding: "18px 20px",
                      borderRadius: "16px",
                      background: "#FAFAF8",
                      border: "1px solid #EAEAEA",
                    }}
                  >
                    <p style={{ ...SF, fontSize: "20px", fontWeight: 600, color: "#272727", margin: "0 0 12px 0" }}>
                      Avaliação registada no serviço
                    </p>
                    <RatingStars rating={resumoAvaliacoes.legacy} />
                    {resumoAvaliacoes.comentServico ? (
                      <p style={{ ...SF, marginTop: "14px", fontSize: "19px", color: "#535353", marginBottom: 0 }}>
                        &ldquo;{resumoAvaliacoes.comentServico}&rdquo;
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        padding: "18px 20px",
                        borderRadius: "16px",
                        background: "#FAFAF8",
                        border: "1px solid #EAEAEA",
                        marginBottom: "14px",
                      }}
                    >
                      <p style={{ ...SF, fontSize: "20px", fontWeight: 600, color: "#272727", margin: "0 0 4px 0" }}>
                        Contratante
                      </p>
                      <p style={{ ...SF, fontSize: "17px", color: "#8E8D8C", margin: "0 0 12px 0" }}>
                        {clienteNome || servico.user_id}
                      </p>
                      {resumoAvaliacoes.notaContratante !== undefined ? (
                        <>
                          <RatingStars rating={resumoAvaliacoes.notaContratante} />
                          {resumoAvaliacoes.comentContratante ? (
                            <p style={{ ...SF, marginTop: "12px", fontSize: "19px", color: "#535353", marginBottom: 0 }}>
                              &ldquo;{resumoAvaliacoes.comentContratante}&rdquo;
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <p style={{ ...SF, fontSize: "19px", color: "#AAAAAA", margin: 0 }}>
                          Sem avaliação registada.
                        </p>
                      )}
                    </div>
                    <div
                      style={{
                        padding: "18px 20px",
                        borderRadius: "16px",
                        background: "#FAFAF8",
                        border: "1px solid #EAEAEA",
                      }}
                    >
                      <p style={{ ...SF, fontSize: "20px", fontWeight: 600, color: "#272727", margin: "0 0 4px 0" }}>
                        Profissional
                      </p>
                      <p style={{ ...SF, fontSize: "17px", color: "#8E8D8C", margin: "0 0 12px 0" }}>
                        {prestadorNome || servico.prestador_id}
                      </p>
                      {resumoAvaliacoes.notaProfissional !== undefined ? (
                        <>
                          <RatingStars rating={resumoAvaliacoes.notaProfissional} />
                          {resumoAvaliacoes.comentProfissional ? (
                            <p style={{ ...SF, marginTop: "12px", fontSize: "19px", color: "#535353", marginBottom: 0 }}>
                              &ldquo;{resumoAvaliacoes.comentProfissional}&rdquo;
                            </p>
                          ) : null}
                        </>
                      ) : (
                        <p style={{ ...SF, fontSize: "19px", color: "#AAAAAA", margin: 0 }}>
                          Sem avaliação registada.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {error ? (
              <p style={{ ...SF, color: "#D92B2E", marginTop: "20px" }}>{error}</p>
            ) : null}

            <div
              style={{
                marginTop: "36px",
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <Link
                href={messagesWithServico(servico.id)}
                style={{
                  ...SF,
                  padding: "14px 26px",
                  borderRadius: "30px",
                  border: "2px solid #272727",
                  color: "#272727",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "22px",
                }}
              >
                Abrir mensagens
              </Link>

              {isParticipant ? (
                <Link
                  href={ROUTES.dashboard}
                  style={{
                    ...SF,
                    padding: "14px 26px",
                    borderRadius: "30px",
                    background: "#EAEAEA",
                    color: "#272727",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "22px",
                  }}
                >
                  Carteira / resumo
                </Link>
              ) : null}
            </div>

            {podeResponder ? (
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "28px",
                  borderTop: "1.5px solid #EAEAEA",
                }}
              >
                <p style={{ ...SF, fontSize: "24px", fontWeight: 700, color: "#272727", marginBottom: "16px" }}>
                  Resposta ao pedido
                </p>
                <p style={{ ...SF, fontSize: "20px", color: "#8E8D8C", marginBottom: "20px" }}>
                  Ao aceitar, o contrato passa a <strong>aceito</strong> e és redirecionado para o dashboard com o contrato em destaque.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void handleStatus("aceito")}
                    style={{
                      ...SF,
                      padding: "16px 32px",
                      borderRadius: "30px",
                      border: "none",
                      background: "#3DBD7D",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "24px",
                      cursor: acting ? "wait" : "pointer",
                    }}
                  >
                    Aceitar contrato
                  </button>
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => void handleStatus("recusado")}
                    style={{
                      ...SF,
                      padding: "16px 32px",
                      borderRadius: "30px",
                      border: "2px solid #D92B2E",
                      background: "transparent",
                      color: "#D92B2E",
                      fontWeight: 600,
                      fontSize: "24px",
                      cursor: acting ? "wait" : "pointer",
                    }}
                  >
                    Recusar
                  </button>
                </div>
              </div>
            ) : null}

            {podeFinalizarPrestador ? (
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "28px",
                  borderTop: "1.5px solid #EAEAEA",
                }}
              >
                <p style={{ ...SF, fontSize: "24px", fontWeight: 700, color: "#272727", marginBottom: "16px" }}>
                  Concluir serviço
                </p>
                <p style={{ ...SF, fontSize: "20px", color: "#8E8D8C", marginBottom: "20px" }}>
                  Quando o trabalho estiver concluído, marca o contrato como <strong>finalizado</strong>. O cliente vê o estado atualizado na lista de contratos.
                </p>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => {
                    if (
                      !window.confirm(
                        "Marcar este serviço como finalizado? Confirme apenas quando o trabalho estiver concluído.",
                      )
                    ) {
                      return;
                    }
                    void handleStatus("finalizado");
                  }}
                  style={{
                    ...SF,
                    padding: "16px 32px",
                    borderRadius: "30px",
                    border: "none",
                    background: "#E0C271",
                    color: "#272727",
                    fontWeight: 700,
                    fontSize: "24px",
                    cursor: acting ? "wait" : "pointer",
                  }}
                >
                  {acting ? "A atualizar…" : "Marcar como finalizado"}
                </button>
              </div>
            ) : null}

            {isCliente && statusParsed && (statusParsed === "criado" || statusParsed === "pendente") ? (
              <p style={{ ...SF, marginTop: "32px", fontSize: "20px", color: "#8E8D8C" }}>
                Aguardas a resposta do prestador. Podes falar no chat enquanto isso.
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
