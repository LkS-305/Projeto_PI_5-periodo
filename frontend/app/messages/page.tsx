"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useMensagem } from "@/utils/hooks/useMensagem";
import { apiClient } from "@/lib/api/client";
import { Mensagem } from "@/types/entities/mensagem";
import { Servico } from "@/types/entities/servico";

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

function getStoredAuth() {
  if (typeof window === "undefined") {
    return { userId: "", token: "" };
  }

  const rawUser =
    localStorage.getItem("authUser") ?? localStorage.getItem("user");
  const token = localStorage.getItem("authToken") ?? "";

  if (!rawUser) {
    return { userId: "", token };
  }

  try {
    const parsed = JSON.parse(rawUser);
    return {
      userId: typeof parsed?.id === "string" ? parsed.id : "",
      token:
        typeof parsed?.token === "string" && parsed.token
          ? parsed.token
          : token,
    };
  } catch {
    return { userId: "", token };
  }
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

export default function MessagesPage() {
  const router = useRouter();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServicoId, setSelectedServicoId] = useState<string | null>(
    null,
  );

  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const { userId, token } = getStoredAuth();
    if (!userId) return;

    startTransition(() => {
      setCurrentUserId(userId);
    });

    const carregarServicos = async () => {
      try {
        const listaUsuario = await apiClient.get<Servico[]>(
          `/servico/buscarPorUserId?id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (listaUsuario.length > 0) {
          setServicos(listaUsuario);
          setSelectedServicoId(listaUsuario[0].id ?? null);
          return;
        }

        const prestador = await apiClient.post<{ user_id: string } | null>(
          "/prestador/buscarPorUserId",
          { user_id: userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!prestador) return;

        const listaPrestador = await apiClient.get<Servico[]>(
          `/servico/buscarPorPrestadorId?id=${prestador.user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (listaPrestador.length > 0) {
          setServicos(listaPrestador);
          setSelectedServicoId(listaPrestador[0].id ?? null);
        }
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
      }
    };

    carregarServicos();
  }, []);

  // Chat do serviço selecionado com polling
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
    if (!trimmed || !selectedServicoId) return;

    await enviar({
      servico_id: selectedServicoId,
      conteudo: trimmed,
      tipo_midia: "texto",
    });

    setNewMessage("");
  };

  return (
    <>
      <div className="messages-page">
        <header className="messages-header">
          <div className="messages-header__logo-wrap">
            <Image
              src="/images/logo_domi.svg"
              alt="DOMI"
              width={70}
              height={60}
              priority
            />
          </div>
          <span className="messages-header__brand">DOMI</span>
          <div
            className="messages-header__back"
            onClick={() => router.push("/home")}
          >
            ← Voltar
          </div>
        </header>

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
                      onClick={() => setSelectedServicoId(conv.servico_id)}
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
              <button type="button" className="messages-chat__project-button">
                Mostrar projeto
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
    </>
  );
}
