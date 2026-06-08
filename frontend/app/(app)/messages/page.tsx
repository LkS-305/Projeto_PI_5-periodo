"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useMensagem } from "@/utils/hooks/useMensagem";
import { ClientGateway, getCurrentUserId } from "@/lib/gateways/ClientGateway";
import { ServicoGateway } from "@/lib/gateways/ServicoGateway";
import { TransacaoGateway } from "@/lib/gateways/TransacaoGateway";
import { Mensagem } from "@/types/entities/mensagem";
import { Servico } from "@/types/entities/servico";
import type { Transacao } from "@/types/entities/transacao";
import { ROUTES, contractDetailPath, messagesWithServico } from "@/lib/routes";
import { useSession } from "@/lib/contexts/SessionContext";
import { labelServicoStatus, parseServicoStatus } from "@/lib/utils/servicoUi";
import { PagamentoCheckoutModal, type PixPayerInfo } from "@/components/pagamento/PagamentoCheckoutModal";
import { OPCOES_PAGAMENTO_SERVICO } from "@/lib/constants/pagamentoServico";
import type { MetodoPagamentoApi } from "@/types/dtos/transacao";
import { Paperclip } from "lucide-react";

// ─── Tipos locais de UI ───────────────────────────────────────────────────────

type ConversationItem = {
  servico_id: string;
  nome: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}h${String(date.getMinutes()).padStart(2, "0")}`;
}

function getMessageTime(message: Mensagem) {
  return message.created_at ?? message.lida_em ?? "";
}

function sortMessagesByTime(messages: Mensagem[]) {
  return [...messages].sort((left, right) => {
    const leftTime = new Date(getMessageTime(left) || 0).getTime();
    const rightTime = new Date(getMessageTime(right) || 0).getTime();

    if (leftTime !== rightTime) {
      return leftTime - rightTime;
    }

    return (left.id ?? "").localeCompare(right.id ?? "");
  });
}

function formatAcordoData(raw: Date | string | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { dateStyle: "long" });
}

/** Valor para `<input type="datetime-local" />` em hora local. */
function toDatetimeLocalValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Componentes auxiliares ──────────────────────────────────────────────────

function MessageBubble({
  message,
  currentUserId,
}: {
  message: Mensagem;
  currentUserId: string;
}) {
  const isMe = message.remetente_id === currentUserId;

  return (
    <div
      className={`message-row ${isMe ? "message-row--me" : "message-row--client"}`}
    >
      <div className="message-bubble-wrap">
        <div className={`message-meta ${isMe ? "message-meta--me" : ""}`}>
          {!isMe ? (
            <Image
              src="/images/fotoPerfil.svg"
              alt="Perfil"
              width={16}
              height={16}
              className="message-meta__avatar"
            />
          ) : null}
          <span className="message-meta__time">
            {getMessageTime(message)
              ? formatTime(new Date(getMessageTime(message)))
              : ""}
          </span>
        </div>

        <div
          className={`message-bubble ${isMe ? "message-bubble--me" : "message-bubble--client"}`}
        >
          <p className="message-bubble__text">{message.conteudo}</p>
          {message.lida_em && isMe ? (
            <Image
              src="/images/Visto.svg"
              alt="Lida"
              width={16}
              height={16}
              className="message-bubble__read"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function IconButton({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <button type="button" aria-label={label} className="icon-button">
      <Image src={iconSrc} alt="" width={18} height={18} aria-hidden="true" />
    </button>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

function MessagesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicoIdFromUrl = searchParams.get("servico_id");

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServicoId, setSelectedServicoId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectServico, setProjectServico] = useState<Servico | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const { user: sessionUser } = useSession();
  const [transacaoServico, setTransacaoServico] = useState<Transacao | null>(null);
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamentoApi>("Pix");
  const [acordoPrecoInput, setAcordoPrecoInput] = useState("");
  const [acordoDataInput, setAcordoDataInput] = useState("");
  const [salvandoAcordo, setSalvandoAcordo] = useState(false);
  const [erroAcordo, setErroAcordo] = useState<string | null>(null);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) return;

    startTransition(() => {
      setCurrentUserId(userId);
    });

    (async () => {
      try {
        const [comoUser, comoPrestador] = await Promise.all([
          ClientGateway.getServicosPorUser(userId).catch(() => [] as Servico[]),
          ClientGateway.getServicosPorPrestador(userId).catch(() => [] as Servico[]),
        ]);
        const map = new Map<string, Servico>();
        [...comoUser, ...comoPrestador].forEach((s) => map.set(s.id, s));
        const merged = Array.from(map.values());
        setServicos(merged);

        const fromUrl = servicoIdFromUrl;
        const exists = fromUrl && merged.some((s) => s.id === fromUrl);
        const pick =
          exists && fromUrl
            ? fromUrl
            : merged[0]?.id ?? null;
        setSelectedServicoId(pick);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
      }
    })();
  }, [servicoIdFromUrl]);

  const selectedServico = useMemo(
    () => servicos.find((s) => s.id === selectedServicoId) ?? null,
    [servicos, selectedServicoId],
  );

  useEffect(() => {
    if (!selectedServicoId) {
      setTransacaoServico(null);
      return;
    }
    let cancelled = false;
    void TransacaoGateway.getByServicoId(selectedServicoId)
      .then((tx) => {
        if (!cancelled) setTransacaoServico(tx);
      })
      .catch(() => {
        if (!cancelled) setTransacaoServico(null);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedServicoId]);

  // Chat do serviço selecionado com polling
  const { mensagens, loading, enviando, enviar, marcarLida } =
    useMensagem(selectedServicoId);

  // UI state
  const [filter, setFilter] = useState<"Todas" | "Não lidas">("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [anexoPendente, setAnexoPendente] = useState<File | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const anexoInputRef = useRef<HTMLInputElement>(null);
  /** Evita chamar marcarLida em loop a cada poll para a mesma mensagem. */
  const marcarLidaPedidoRef = useRef<Set<string>>(new Set());

  // Scroll automático ao chegar nova mensagem
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [mensagens.length]);

  useEffect(() => {
    marcarLidaPedidoRef.current.clear();
  }, [selectedServicoId]);

  // Marca como lidas só uma vez por mensagem (não repetir a cada polling)
  useEffect(() => {
    if (!selectedServicoId) return;
    mensagens
      .filter((m) => m.servico_id === selectedServicoId)
      .filter((m) => m.id && !m.lida_em && m.remetente_id !== currentUserId)
      .forEach((m) => {
        const id = m.id!;
        if (marcarLidaPedidoRef.current.has(id)) return;
        marcarLidaPedidoRef.current.add(id);
        void marcarLida(id);
      });
  }, [mensagens, currentUserId, marcarLida, selectedServicoId]);

  // Monta lista de conversas a partir dos serviços
  const conversationList = useMemo<ConversationItem[]>(() => {
    return servicos.map((s) => {
      const mensagensDoServico = sortMessagesByTime(
        mensagens.filter((m) => m.servico_id === s.id),
      );
      const ultimaMensagem = mensagensDoServico.at(-1);
      const naoLidas = mensagens.filter(
        (m) =>
          m.servico_id === s.id &&
          !m.lida_em &&
          m.remetente_id !== currentUserId,
      ).length;

      return {
        servico_id: s.id ?? "",
        nome: s.titulo,
        role: s.categoria,
        preview: ultimaMensagem?.conteudo ?? "Sem mensagens ainda",
        time:
          ultimaMensagem && getMessageTime(ultimaMensagem)
            ? formatTime(new Date(getMessageTime(ultimaMensagem)))
            : "",
        unread: naoLidas,
      };
    });
  }, [servicos, mensagens, currentUserId]);

  const visibleConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversationList.filter((c) => {
      const matchUnread = filter !== "Não lidas" || c.unread > 0;
      const matchSearch =
        q.length === 0 || `${c.nome} ${c.role}`.toLowerCase().includes(q);
      return matchUnread && matchSearch;
    });
  }, [conversationList, filter, searchQuery]);

  const selectedConv = conversationList.find(
    (c) => c.servico_id === selectedServicoId,
  );

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    const linhaAnexo = anexoPendente ? `📎 ${anexoPendente.name}` : "";
    let conteudo = [linhaAnexo, trimmed].filter(Boolean).join("\n").trim();
    if (!conteudo || !selectedServicoId) return;
    if (conteudo.length > 2000) {
      conteudo = conteudo.slice(0, 2000);
    }

    await enviar({
      servico_id: selectedServicoId,
      conteudo,
      tipo_midia: "texto",
    });

    setNewMessage("");
    setAnexoPendente(null);
    if (anexoInputRef.current) anexoInputRef.current.value = "";
  };

  const handleEscolherAnexo = () => {
    anexoInputRef.current?.click();
  };

  const handleAnexoSelecionado = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setAnexoPendente(f ?? null);
  };

  const removerAnexo = () => {
    setAnexoPendente(null);
    if (anexoInputRef.current) anexoInputRef.current.value = "";
  };

  const openProjectPanel = () => {
    if (!selectedServicoId) return;
    setProjectOpen(true);
    setProjectLoading(true);
    setProjectServico(null);
    void ClientGateway.getServicoById(selectedServicoId)
      .then((s) => {
        setProjectServico(
          s ?? servicos.find((x) => x.id === selectedServicoId) ?? null,
        );
      })
      .catch(() => {
        setProjectServico(
          servicos.find((x) => x.id === selectedServicoId) ?? null,
        );
      })
      .finally(() => setProjectLoading(false));
  };

  const refetchServicosETransacao = useCallback(async () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    try {
      const [comoUser, comoPrestador] = await Promise.all([
        ClientGateway.getServicosPorUser(userId).catch(() => [] as Servico[]),
        ClientGateway.getServicosPorPrestador(userId).catch(() => [] as Servico[]),
      ]);
      const map = new Map<string, Servico>();
      [...comoUser, ...comoPrestador].forEach((s) => map.set(s.id, s));
      const merged = Array.from(map.values());
      setServicos(merged);

      const sid = selectedServicoId;
      if (sid) {
        const tx = await TransacaoGateway.getByServicoId(sid).catch(() => null);
        setTransacaoServico(tx);
        if (projectOpen) {
          const fresh = await ClientGateway.getServicoById(sid).catch(() => null);
          if (fresh) setProjectServico(fresh);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [selectedServicoId, projectOpen]);

  const pagamentoUi = useMemo(() => {
    const userId = currentUserId;
    const s = selectedServico;
    const empty = {
      isCliente: false,
      isPrestador: false,
      mostrarBotao: false,
      pendente: false,
      jaPago: false,
      valorOk: false,
      stOk: false,
      stLabel: "",
      payer: null as PixPayerInfo | null,
    };
    if (!s || !userId) return empty;

    const isCliente = s.user_id === userId;
    const isPrestador = s.prestador_id === userId;
    const tx = transacaoServico;
    const pendente = tx?.status === "pendente";
    const jaPago = tx?.status === "aprovada" || tx?.status === "concluido";
    const valorOk = Number(s.preco_acordado) > 0;
    const st = parseServicoStatus(s.status as string);
    const stOk = st === "aceito" || st === "emAndamento";
    const stLabel = labelServicoStatus(s);

    if (!isCliente) {
      return {
        isCliente: false,
        isPrestador,
        mostrarBotao: false,
        pendente,
        jaPago,
        valorOk,
        stOk,
        stLabel,
        payer: null as PixPayerInfo | null,
      };
    }

    const mostrarBotao = stOk && valorOk && !pendente && !jaPago;
    const payer: PixPayerInfo | null =
      sessionUser && mostrarBotao
        ? {
            user_id: s.user_id,
            cpf: sessionUser.cpf ?? "",
            nome: sessionUser.email.split("@")[0]?.trim() || "Cliente",
            email: sessionUser.email ?? "",
          }
        : null;
    return {
      isCliente: true,
      isPrestador: false,
      mostrarBotao,
      pendente,
      jaPago,
      valorOk,
      stOk,
      stLabel,
      payer,
    };
  }, [selectedServico, currentUserId, sessionUser, transacaoServico]);

  const podeEditarAcordoPanel = useMemo(() => {
    if (!projectServico || !currentUserId) return false;
    const participa =
      projectServico.user_id === currentUserId ||
      projectServico.prestador_id === currentUserId;
    if (!participa) return false;
    const st = parseServicoStatus(projectServico.status as string);
    if (["finalizado", "cancelado", "recusado"].includes(st)) return false;
    if (pagamentoUi.jaPago) return false;
    if (pagamentoUi.pendente) return false;
    return true;
  }, [projectServico, currentUserId, pagamentoUi.jaPago, pagamentoUi.pendente]);

  useEffect(() => {
    if (!projectOpen || !projectServico) return;
    setErroAcordo(null);
    const n = Number(projectServico.preco_acordado ?? 0);
    setAcordoPrecoInput(Number.isFinite(n) ? String(n) : "");
    const raw = projectServico.data_inicio;
    const d = raw ? new Date(raw) : new Date();
    setAcordoDataInput(toDatetimeLocalValue(d));
  }, [projectOpen, projectServico?.id, projectServico?.preco_acordado, projectServico?.data_inicio]);

  const handleSalvarAcordo = useCallback(async () => {
    if (!projectServico || !podeEditarAcordoPanel) return;
    const preco = Number.parseFloat(acordoPrecoInput.replace(",", ".").trim());
    if (Number.isNaN(preco) || preco <= 0) {
      setErroAcordo("Indica um valor maior que zero.");
      return;
    }
    if (!acordoDataInput.trim()) {
      setErroAcordo("Indica a data e hora de início.");
      return;
    }
    const dataIni = new Date(acordoDataInput);
    if (Number.isNaN(dataIni.getTime())) {
      setErroAcordo("Data inválida.");
      return;
    }
    setSalvandoAcordo(true);
    setErroAcordo(null);
    try {
      await ServicoGateway.atualizarServico({
        id: projectServico.id,
        preco_acordado: preco,
        data_inicio: dataIni.toISOString(),
      });
      const fresh = await ClientGateway.getServicoById(projectServico.id);
      if (fresh) setProjectServico(fresh);
      await refetchServicosETransacao();
    } catch (e) {
      setErroAcordo(e instanceof Error ? e.message : "Não foi possível guardar.");
    } finally {
      setSalvandoAcordo(false);
    }
  }, [
    projectServico,
    podeEditarAcordoPanel,
    acordoPrecoInput,
    acordoDataInput,
    refetchServicosETransacao,
  ]);

  return (
    <>
      <div className="messages-page">
        <main className="messages-main">
          <aside className="messages-sidebar">
            <div className="messages-sidebar__header">
              <button
                type="button"
                className="messages-sidebar__hub-link"
                onClick={() => router.push(ROUTES.hub)}
              >
                ← Voltar ao hub
              </button>
              <div className="messages-sidebar__title-row">
                <h1 className="messages-sidebar__title">Mensagens</h1>
                <div className="messages-sidebar__actions">
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen((p) => !p)}
                    aria-label="Pesquisar"
                    aria-pressed={isSearchOpen}
                    className="icon-button"
                  >
                    <Image
                      src="/images/lupa2.svg"
                      alt=""
                      width={18}
                      height={18}
                      aria-hidden="true"
                    />
                  </button>
                  <IconButton
                    label="Arquivar"
                    iconSrc="/images/Arquivadas.svg"
                  />
                </div>
              </div>

              {isSearchOpen ? (
                <div className="messages-sidebar__search">
                  <Image
                    src="/images/lupa2.svg"
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar"
                    className="messages-sidebar__search-input"
                  />
                </div>
              ) : null}

              <div className="messages-sidebar__filters">
                {(["Todas", "Não lidas"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`messages-sidebar__filter-btn ${
                      filter === option
                        ? "messages-sidebar__filter-btn--active"
                        : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="messages-sidebar__list scrollbar-hidden">
              {visibleConversations.length === 0 ? (
                <p
                  style={{ padding: "1rem", color: "var(--color-text-muted)" }}
                >
                  Nenhuma conversa encontrada.
                </p>
              ) : (
                visibleConversations.map((conv) => {
                  const isSelected = conv.servico_id === selectedServicoId;
                  return (
                    <button
                      key={conv.servico_id}
                      type="button"
                      onClick={() => {
                        setSelectedServicoId(conv.servico_id);
                        router.replace(messagesWithServico(conv.servico_id), {
                          scroll: false,
                        });
                      }}
                      className={`messages-conversation-item ${
                        isSelected
                          ? "messages-conversation-item--selected"
                          : "messages-conversation-item--idle"
                      }`}
                    >
                      <Image
                        src="/images/fotoPerfil.svg"
                        alt="Perfil"
                        width={45}
                        height={45}
                        className="messages-conversation-item__avatar"
                      />
                      <div className="messages-conversation-item__content">
                        <div className="messages-conversation-item__name-row">
                          <span className="messages-conversation-item__name">
                            {conv.nome}
                          </span>
                          <span className="messages-conversation-item__separator">
                            -
                          </span>
                          <span className="messages-conversation-item__role">
                            {conv.role}
                          </span>
                        </div>
                        <p className="messages-conversation-item__preview">
                          {conv.preview}
                        </p>
                        <div className="messages-conversation-item__meta">
                          <span className="messages-conversation-item__date">
                            {conv.time}
                          </span>
                          {conv.unread > 0 ? (
                            <span className="messages-conversation-item__unread">
                              {conv.unread}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}

              <div className="messages-sidebar__end">
                ...
                <br />
                Parece que você chegou ao fim!
              </div>
            </div>
          </aside>

          <section className="messages-chat">
            <div className="messages-chat__header">
              <div className="messages-chat__contact">
                <Image
                  src="/images/fotoPerfil.svg"
                  alt="Perfil"
                  width={55}
                  height={55}
                  className="messages-chat__contact-avatar"
                />
                <div className="messages-chat__contact-info">
                  <h2 className="messages-chat__contact-name">
                    {selectedConv?.nome ?? "Selecione uma conversa"}
                  </h2>
                  <p className="messages-chat__contact-role">
                    {selectedConv?.role ?? ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="messages-chat__project-button"
                onClick={openProjectPanel}
              >
                Acordo e pagamento
              </button>
            </div>

            <div
              ref={messageListRef}
              className="messages-chat__messages scrollbar-hidden"
            >
              {loading ? (
                <p
                  style={{ padding: "1rem", color: "var(--color-text-muted)" }}
                >
                  Carregando mensagens...
                </p>
              ) : (
                <div className="messages-chat__message-column">
                  {sortMessagesByTime(mensagens).map((m) => (
                    <MessageBubble
                      key={m.id}
                      message={m}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
              )}
            </div>

            {selectedServico && pagamentoUi.isPrestador && pagamentoUi.valorOk && !pagamentoUi.jaPago ? (
              <div className="messages-chat__pay-strip messages-chat__pay-strip--prestador">
                <div className="messages-chat__pay-strip-inner">
                  <span className="messages-chat__pay-strip-label">
                    {Number(selectedServico.preco_acordado ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    · {formatAcordoData(selectedServico.data_inicio)}
                  </span>
                  <span className="messages-chat__pay-strip-hint">
                    {pagamentoUi.pendente
                      ? "O cliente já iniciou um pagamento — aguarda a confirmação do Asaas."
                      : "Só o contratante vê o botão «Pagar serviço». Ele aparece quando o serviço estiver aceito ou em andamento."}
                  </span>
                </div>
              </div>
            ) : null}

            {selectedServico && pagamentoUi.isCliente && pagamentoUi.valorOk && !pagamentoUi.jaPago ? (
              <div
                className={`messages-chat__pay-strip ${
                  pagamentoUi.mostrarBotao ? "messages-chat__pay-strip--action" : ""
                }`}
              >
                <div className="messages-chat__pay-strip-inner">
                  <span className="messages-chat__pay-strip-label">
                    {Number(selectedServico.preco_acordado ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}{" "}
                    · {formatAcordoData(selectedServico.data_inicio)}
                  </span>
                  {pagamentoUi.pendente ? (
                    <span className="messages-chat__pay-strip-status">
                      {transacaoServico?.metodo_pagamento === "Boleto"
                        ? "Boleto pendente"
                        : transacaoServico?.metodo_pagamento === "Credito"
                          ? "Fatura Asaas pendente"
                          : transacaoServico?.metodo_pagamento === "Pix"
                            ? "PIX pendente"
                            : "Pagamento pendente"}
                    </span>
                  ) : null}
                  {!pagamentoUi.mostrarBotao && !pagamentoUi.pendente ? (
                    <span className="messages-chat__pay-strip-hint">
                      O botão <strong>Pagar serviço</strong> aparece quando o contrato estiver{" "}
                      <strong>aceito</strong> ou <strong>em andamento</strong>. Agora:{" "}
                      <strong>{pagamentoUi.stLabel}</strong>.
                    </span>
                  ) : null}
                  {pagamentoUi.mostrarBotao ? (
                    <>
                      <div
                        className="messages-chat__pay-methods"
                        role="radiogroup"
                        aria-label="Forma de pagamento"
                      >
                        {OPCOES_PAGAMENTO_SERVICO.map((op) => (
                          <button
                            key={op.id}
                            type="button"
                            role="radio"
                            aria-checked={metodoPagamento === op.id}
                            disabled={pagamentoModalOpen}
                            className={`messages-chat__pay-method-pill ${
                              metodoPagamento === op.id ? "messages-chat__pay-method-pill--active" : ""
                            }`}
                            onClick={() => setMetodoPagamento(op.id)}
                            title={op.descricao}
                          >
                            {op.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="messages-chat__pay-strip-btn"
                        onClick={() => setPagamentoModalOpen(true)}
                      >
                        Pagar serviço
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="messages-chat__composer-wrap">
              <div className="messages-chat__composer">
                <input
                  ref={anexoInputRef}
                  type="file"
                  className="composer__file-input"
                  onChange={handleAnexoSelecionado}
                />
                <button
                  type="button"
                  className="composer__attach-button"
                  aria-label="Anexar ficheiro"
                  title="Anexar ficheiro"
                  disabled={enviando}
                  onClick={handleEscolherAnexo}
                >
                  <Paperclip size={22} strokeWidth={2} color="#555555" aria-hidden />
                </button>
                {anexoPendente ? (
                  <div className="composer__attached-file" title={anexoPendente.name}>
                    <span className="composer__attached-file-name">{anexoPendente.name}</span>
                    <button
                      type="button"
                      className="composer__remove-attachment"
                      aria-label="Remover anexo"
                      onClick={removerAnexo}
                    >
                      ×
                    </button>
                  </div>
                ) : null}
                <input
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Escreva uma mensagem..."
                  className="composer__input"
                  disabled={enviando}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  aria-label="Enviar"
                  className="composer__send-button"
                  disabled={enviando}
                >
                  <Image
                    src="/images/enviar.svg"
                    alt="Enviar"
                    width={36}
                    height={36}
                  />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {projectOpen ? (
        <div
          className="messages-project-overlay"
          role="presentation"
          onClick={() => setProjectOpen(false)}
        >
          <div
            className="messages-project-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="messages-project-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="messages-project-panel__head">
              <h2 id="messages-project-title" className="messages-project-panel__title">
                Acordo de preço e datas
              </h2>
              <button
                type="button"
                className="messages-project-panel__close"
                onClick={() => setProjectOpen(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            {projectLoading ? (
              <p className="messages-project-panel__muted">A carregar…</p>
            ) : projectServico ? (
              <div className="messages-project-panel__body">
                <p className="messages-project-panel__chip">{projectServico.categoria}</p>
                <h3 className="messages-project-panel__servico-title">{projectServico.titulo}</h3>
                <p className="messages-project-panel__desc">
                  {projectServico.descricao?.trim() || "Sem descrição."}
                </p>
                <p className="messages-project-panel__meta">
                  Estado: <strong>{projectServico.status}</strong>
                  {" · "}
                  Valor:{" "}
                  <strong>
                    {Number(projectServico.preco_acordado ?? 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </strong>
                </p>
                <p className="messages-project-panel__meta">
                  Data combinada: <strong>{formatAcordoData(projectServico.data_inicio)}</strong>
                  {" · "}
                  Duração / prazo: <strong>{projectServico.duracao?.trim() || "—"}</strong>
                </p>
                {(projectServico.user_id === currentUserId ||
                  projectServico.prestador_id === currentUserId) &&
                !podeEditarAcordoPanel &&
                (pagamentoUi.pendente || pagamentoUi.jaPago) ? (
                  <p className="messages-project-panel__pay-hint messages-project-panel__pay-hint--info">
                    {pagamentoUi.pendente
                      ? "Não é possível alterar valor ou data enquanto existir um pagamento pendente no Asaas."
                      : "Valor e data deixam de ser editáveis após o pagamento concluído."}
                  </p>
                ) : null}
                {(projectServico.user_id === currentUserId ||
                  projectServico.prestador_id === currentUserId) &&
                podeEditarAcordoPanel ? (
                  <div className="messages-project-panel__acordo-form">
                    <p className="messages-project-panel__acordo-title">Ajustar acordo</p>
                    <p className="messages-project-panel__acordo-sub">
                      Valor e data de início combinados (ambas as partes vêem a atualização).
                    </p>
                    {erroAcordo ? (
                      <p className="messages-project-panel__acordo-erro" role="alert">
                        {erroAcordo}
                      </p>
                    ) : null}
                    <label className="messages-project-panel__acordo-field">
                      <span>Valor (R$)</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={acordoPrecoInput}
                        onChange={(e) => setAcordoPrecoInput(e.target.value)}
                        disabled={salvandoAcordo}
                        className="messages-project-panel__acordo-input"
                      />
                    </label>
                    <label className="messages-project-panel__acordo-field">
                      <span>Data e hora de início</span>
                      <input
                        type="datetime-local"
                        value={acordoDataInput}
                        onChange={(e) => setAcordoDataInput(e.target.value)}
                        disabled={salvandoAcordo}
                        className="messages-project-panel__acordo-input"
                      />
                    </label>
                    <button
                      type="button"
                      className="messages-project-panel__acordo-save"
                      disabled={salvandoAcordo}
                      onClick={() => void handleSalvarAcordo()}
                    >
                      {salvandoAcordo ? "A guardar…" : "Guardar acordo"}
                    </button>
                  </div>
                ) : null}
                {projectServico.user_id === currentUserId ? (
                  <>
                    {pagamentoUi.pendente ? (
                      <p className="messages-project-panel__pay-hint messages-project-panel__pay-hint--pending">
                        Pagamento pendente (
                        {transacaoServico?.metodo_pagamento === "Boleto"
                          ? "boleto"
                          : transacaoServico?.metodo_pagamento === "Credito"
                            ? "fatura Asaas"
                            : "PIX"}
                        ) — conclui no banco ou aguarda a confirmação do Asaas. O serviço passa a{" "}
                        <strong>em andamento</strong> após o webhook.
                      </p>
                    ) : null}
                    {pagamentoUi.jaPago ? (
                      <p className="messages-project-panel__pay-hint messages-project-panel__pay-hint--ok">
                        Pagamento registado. O prestador pode seguir com o serviço.
                      </p>
                    ) : null}
                    {projectServico.user_id === currentUserId &&
                    !pagamentoUi.jaPago &&
                    Number(projectServico.preco_acordado) > 0 &&
                    !pagamentoUi.mostrarBotao &&
                    !pagamentoUi.pendente ? (
                      <p className="messages-project-panel__pay-hint messages-project-panel__pay-hint--info">
                        O botão <strong>Pagar serviço</strong> aparece na barra <strong>logo acima do campo de
                        mensagens</strong> quando o contrato estiver <strong>aceito</strong> ou{" "}
                        <strong>em andamento</strong>. Agora: <strong>{labelServicoStatus(projectServico)}</strong>.
                      </p>
                    ) : null}
                  </>
                ) : null}
                <div className="messages-project-panel__actions">
                  {projectServico.user_id === currentUserId && pagamentoUi.mostrarBotao ? (
                    <div className="messages-project-panel__pay-block">
                      <p className="messages-project-panel__pay-methods-label">Forma de pagamento</p>
                      <div
                        className="messages-chat__pay-methods messages-chat__pay-methods--panel"
                        role="radiogroup"
                        aria-label="Forma de pagamento"
                      >
                        {OPCOES_PAGAMENTO_SERVICO.map((op) => (
                          <button
                            key={op.id}
                            type="button"
                            role="radio"
                            aria-checked={metodoPagamento === op.id}
                            disabled={pagamentoModalOpen}
                            className={`messages-chat__pay-method-pill ${
                              metodoPagamento === op.id ? "messages-chat__pay-method-pill--active" : ""
                            }`}
                            onClick={() => setMetodoPagamento(op.id)}
                            title={op.descricao}
                          >
                            {op.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="messages-project-panel__pay-btn"
                        onClick={() => setPagamentoModalOpen(true)}
                      >
                        Pagar serviço
                      </button>
                    </div>
                  ) : null}
                  <Link
                    href={contractDetailPath(projectServico.id)}
                    className="messages-project-panel__link messages-project-panel__link--primary"
                    onClick={() => setProjectOpen(false)}
                  >
                    Ver página do contrato
                  </Link>
                  <Link
                    href={ROUTES.contracts}
                    className="messages-project-panel__link"
                    onClick={() => setProjectOpen(false)}
                  >
                    Meus contratos
                  </Link>
                </div>
              </div>
            ) : (
              <p className="messages-project-panel__muted">Não foi possível carregar o serviço.</p>
            )}
          </div>
        </div>
      ) : null}

      <PagamentoCheckoutModal
        open={pagamentoModalOpen}
        onClose={() => setPagamentoModalOpen(false)}
        servicoId={selectedServico?.id ?? ""}
        valorReais={Number(selectedServico?.preco_acordado ?? 0)}
        payer={pagamentoUi.payer}
        metodo={metodoPagamento}
        onSucesso={() => void refetchServicosETransacao()}
      />
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="messages-page messages-page--loading-fallback">
          <p>A carregar…</p>
        </div>
      }
    >
      <MessagesPageInner />
    </Suspense>
  );
}
