"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMensagem } from "@/utils/hooks/useMensagem";
import { useServicosInbox } from "@/utils/hooks/useServicosInbox";
import { useSession } from "@/lib/contexts/AuthContext";
import { MvpShell } from "@/components/MvpShell";
import { Mensagem } from "@/types/entities/mensagem";
import { Servico } from "@/types/entities/servico";
import { PrestadorGateway } from "@/lib/gateways/PrestadorGateway";
import { formatDateTimePtBR } from "@/utils/formatDisplay";
import { labelServicoStatus } from "@/utils/servicoUi";

const DEFAULT_AVATAR = "/images/fotoPerfil.svg";

function vitrinaAvatarSrc(foto_url: string | null | undefined): {
  src: string;
  unoptimized: boolean;
} {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
  if (!foto_url?.trim()) return { src: DEFAULT_AVATAR, unoptimized: false };
  const u = foto_url.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) {
    return { src: u, unoptimized: true };
  }
  if (u.startsWith("/")) return { src: `${apiBase}${u}`, unoptimized: true };
  return { src: `${apiBase}/${u}`, unoptimized: true };
}

type PrestadorVitrinaBrief = { nome: string; foto_url: string | null };

type ConversationItem = {
  servico_id: string;
  nome: string;
  counterparty: string;
  statusLabel: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
  avatarSrc: string;
  avatarUnoptimized: boolean;
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

function counterpartyLabelForServico(
  s: Servico,
  currentUserId: string,
  prestadorNomes: Record<string, string>,
): string {
  if (s.user_id === currentUserId) {
    return prestadorNomes[s.prestador_id] ?? "Prestador";
  }
  if (s.prestador_id === currentUserId) {
    return `Cliente (${s.user_id.slice(0, 8)}…)`;
  }
  return "Conversa";
}
function MessageBubble({
  message,
  currentUserId,
  servico,
  prestadorVitrina,
}: {
  message: Mensagem;
  currentUserId: string;
  servico: Servico | null;
  prestadorVitrina: Record<string, PrestadorVitrinaBrief>;
}) {
  const isMe = message.remetente_id === currentUserId;

  const peerAvatar = (() => {
    if (isMe || !servico) return vitrinaAvatarSrc(null);
    if (message.remetente_id === servico.prestador_id) {
      const raw = prestadorVitrina[servico.prestador_id]?.foto_url;
      return vitrinaAvatarSrc(raw);
    }
    return vitrinaAvatarSrc(null);
  })();

  return (
    <div
      className={`message-row ${isMe ? "message-row--me" : "message-row--client"}`}
    >
      <div className="message-bubble-wrap">
        <div className={`message-meta ${isMe ? "message-meta--me" : ""}`}>
          {!isMe ? (
            <Image
              src={peerAvatar.src}
              alt=""
              width={16}
              height={16}
              unoptimized={peerAvatar.unoptimized}
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

function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const servicoFromUrl = searchParams.get("servico");
  const { user, loading: authLoading } = useSession();
  const userId = user?.id ?? "";
  const { servicos, loading: servicosLoading, error: servicosError } =
    useServicosInbox(userId || undefined);
  /** Conversa escolhida na lista (query `servico` tem prioridade no cálculo abaixo). */
  const [userPickedServicoId, setUserPickedServicoId] = useState<string | null>(
    null,
  );
  const [prestadorVitrina, setPrestadorVitrina] = useState<
    Record<string, PrestadorVitrinaBrief>
  >({});

  const prestadorNomes = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(prestadorVitrina).map(([id, v]) => [id, v.nome]),
      ),
    [prestadorVitrina],
  );

  const prestadorIdsKey = useMemo(() => {
    if (!userId) return "";
    const ids = new Set<string>();
    servicos.forEach((s) => {
      if (s.user_id === userId && s.prestador_id) ids.add(s.prestador_id);
    });
    return [...ids].sort().join("|");
  }, [servicos, userId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!prestadorIdsKey) {
        await Promise.resolve();
        if (!cancelled) setPrestadorVitrina({});
        return;
      }
      const ids = prestadorIdsKey.split("|").filter(Boolean);
      const map: Record<string, PrestadorVitrinaBrief> = {};
      for (const id of ids) {
        try {
          const p = await PrestadorGateway.getByUserId(id);
          map[id] = {
            nome: p?.nome ?? "Prestador",
            foto_url: p?.foto_url ?? null,
          };
        } catch {
          map[id] = { nome: "Prestador", foto_url: null };
        }
      }
      if (!cancelled) setPrestadorVitrina(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [prestadorIdsKey]);

  const selectedServicoId = useMemo(() => {
    if (!servicos.length) return null;
    if (servicoFromUrl && servicos.some((s) => s.id === servicoFromUrl)) {
      return servicoFromUrl;
    }
    if (
      userPickedServicoId &&
      servicos.some((s) => s.id === userPickedServicoId)
    ) {
      return userPickedServicoId;
    }
    return servicos[0].id ?? null;
  }, [servicos, servicoFromUrl, userPickedServicoId]);

  const currentUserId = userId;
  const { mensagens, loading, enviando, enviar, marcarLida } =
    useMensagem(selectedServicoId);

  // UI state
  const [filter, setFilter] = useState<"Todas" | "Não lidas">("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Scroll automático ao chegar nova mensagem
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [mensagens.length]);

  // Marca como lidas as mensagens não lidas ao abrir a conversa
  useEffect(() => {
    mensagens
      .filter((m) => !m.lida_em && m.remetente_id !== currentUserId)
      .forEach((m) => marcarLida(m.id!));
  }, [mensagens, currentUserId, marcarLida]);

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

      const listAvatar =
        s.user_id === currentUserId && s.prestador_id
          ? vitrinaAvatarSrc(prestadorVitrina[s.prestador_id]?.foto_url)
          : { src: DEFAULT_AVATAR, unoptimized: false };

      return {
        servico_id: s.id ?? "",
        nome: s.titulo,
        counterparty: counterpartyLabelForServico(
          s,
          currentUserId,
          prestadorNomes,
        ),
        statusLabel: labelServicoStatus(s.status),
        role: s.categoria?.trim() ? s.categoria : "Sem categoria",
        preview: ultimaMensagem?.conteudo ?? "Sem mensagens ainda",
        time:
          ultimaMensagem && getMessageTime(ultimaMensagem)
            ? formatDateTimePtBR(getMessageTime(ultimaMensagem))
            : s.created_at
              ? formatDateTimePtBR(s.created_at)
              : "",
        unread: naoLidas,
        avatarSrc: listAvatar.src,
        avatarUnoptimized: listAvatar.unoptimized,
      };
    });
  }, [servicos, mensagens, currentUserId, prestadorNomes, prestadorVitrina]);

  const visibleConversations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return conversationList.filter((c) => {
      const matchUnread = filter !== "Não lidas" || c.unread > 0;
      const matchSearch =
        q.length === 0 ||
        `${c.nome} ${c.role} ${c.counterparty} ${c.statusLabel}`
          .toLowerCase()
          .includes(q);
      return matchUnread && matchSearch;
    });
  }, [conversationList, filter, searchQuery]);

  const selectedConv = conversationList.find(
    (c) => c.servico_id === selectedServicoId,
  );

  const selectedServico = useMemo(
    () => servicos.find((s) => s.id === selectedServicoId) ?? null,
    [servicos, selectedServicoId],
  );

  const selectedHeaderAvatar = useMemo(() => {
    if (!selectedServico || !userId) {
      return { src: DEFAULT_AVATAR, unoptimized: false };
    }
    if (
      selectedServico.user_id === userId &&
      selectedServico.prestador_id
    ) {
      return vitrinaAvatarSrc(
        prestadorVitrina[selectedServico.prestador_id]?.foto_url,
      );
    }
    return { src: DEFAULT_AVATAR, unoptimized: false };
  }, [selectedServico, prestadorVitrina, userId]);

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed || !selectedServicoId) return;

    await enviar({
      servico_id: selectedServicoId,
      conteudo: trimmed,
      tipo_midia: "texto",
    });

    setNewMessage("");
  };

  return (
    <MvpShell backHref="/dashboard" backLabel="← Dashboard">
      <div className="messages-page messages-page--mvp">
        <main className="messages-main">
          <aside className="messages-sidebar">
            <div className="messages-sidebar__header">
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

              {servicosError ? (
                <div
                  className="mvp-alert mvp-alert--error"
                  role="alert"
                  style={{ margin: "0 0.75rem 0.75rem", fontSize: "0.85rem" }}
                >
                  {servicosError}
                </div>
              ) : null}
            </div>

            <div className="messages-sidebar__list scrollbar-hidden">
              {authLoading || servicosLoading ? (
                <p
                  style={{ padding: "1rem", color: "var(--color-text-muted)" }}
                >
                  A carregar conversas…
                </p>
              ) : visibleConversations.length === 0 ? (
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
                      onClick={() => setUserPickedServicoId(conv.servico_id)}
                      className={`messages-conversation-item ${
                        isSelected
                          ? "messages-conversation-item--selected"
                          : "messages-conversation-item--idle"
                      }`}
                    >
                      <Image
                        src={conv.avatarSrc}
                        alt=""
                        width={45}
                        height={45}
                        unoptimized={conv.avatarUnoptimized}
                        className="messages-conversation-item__avatar"
                      />
                      <div className="messages-conversation-item__content">
                        <div className="messages-conversation-item__name-row">
                          <span className="messages-conversation-item__name">
                            {conv.nome}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--color-text-muted)",
                            margin: "0.15rem 0 0.2rem",
                          }}
                        >
                          {conv.counterparty} · {conv.statusLabel} · {conv.role}
                        </p>
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
                <span style={{ opacity: 0.65 }}>Fim da lista</span>
              </div>
            </div>
          </aside>

          <section className="messages-chat">
            <div className="messages-chat__header">
              <div className="messages-chat__contact">
                <Image
                  src={selectedHeaderAvatar.src}
                  alt=""
                  width={55}
                  height={55}
                  unoptimized={selectedHeaderAvatar.unoptimized}
                  className="messages-chat__contact-avatar"
                />
                <div className="messages-chat__contact-info">
                  <h2 className="messages-chat__contact-name">
                    {selectedConv?.nome ?? "Selecione uma conversa"}
                  </h2>
                  <p className="messages-chat__contact-role">
                    {selectedConv
                      ? `${selectedConv.counterparty} · ${selectedConv.statusLabel} · ${selectedConv.role}`
                      : ""}
                  </p>
                  {selectedServico?.created_at ? (
                    <p
                      style={{
                        margin: "0.2rem 0 0",
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Pedido: {formatDateTimePtBR(selectedServico.created_at)}
                    </p>
                  ) : null}
                </div>
              </div>
              {selectedServicoId ? (
                <button
                  type="button"
                  className="messages-chat__project-button"
                  onClick={() => router.push(`/servicos/${selectedServicoId}/acordo`)}
                >
                  Acordo
                </button>
              ) : null}
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
                      servico={selectedServico}
                      prestadorVitrina={prestadorVitrina}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="messages-chat__composer-wrap">
              <div className="messages-chat__composer">
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
    </MvpShell>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <MvpShell backHref="/dashboard" backLabel="← Dashboard">
          <div style={{ padding: "clamp(24px, 5vw, 48px)" }}>
            A carregar mensagens…
          </div>
        </MvpShell>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}
