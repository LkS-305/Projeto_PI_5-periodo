"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

type Conversation = {
  id: string;
  name: string;
  role: string;
  location?: string;
  preview: string;
  time: string;
  date: string;
  unread: number;
};

type Message = {
  id: string;
  sender: "me" | "client";
  text: string;
  time: string;
  read?: boolean;
  attachmentName?: string;
  attachmentSize?: number;
  attachmentMimeType?: string;
  attachmentDataUrl?: string;
};

const initialConversations: Conversation[] = [
  {
    id: "1",
    name: "Jeferson Thomas Pereira",
    role: "Pintor",
    location: "Sao Paulo, SP",
    preview: "Estou a caminho...",
    time: "13h33",
    date: "25 - 28 abr. de 2026",
    unread: 2,
  },
  {
    id: "2",
    name: "Karla N.",
    role: "Eletricista",
    preview: "Muito obrigado!",
    time: "10h02",
    date: "25 - 30 abr. de 2026",
    unread: 0,
  },
  {
    id: "3",
    name: "Cláudia A.",
    role: "Piscineira",
    preview: "Comprei cloro que você pediu",
    time: "07h30",
    date: "10 - 11 abr. de 2026",
    unread: 0,
  },
  {
    id: "4",
    name: "João Paulo C.",
    role: "Pedreiro",
    preview: "Fica faltando a laje",
    time: "16h21",
    date: "02 - 22 abr. de 2026",
    unread: 1,
  },
  {
    id: "5",
    name: "Lúcio V.",
    role: "Azulejista",
    preview: "Show",
    time: "15h07",
    date: "21 - 26 abr. de 2026",
    unread: 0,
  },
  {
    id: "6",
    name: "Jorge J.",
    role: "Encanador",
    preview: "Termino semana que vem!",
    time: "06h07",
    date: "16 - 20 abr. de 2026",
    unread: 0,
  },
  {
    id: "7",
    name: "Carlos A.",
    role: "Montador de...",
    preview: "Combinado!",
    time: "20h09",
    date: "15 - 16 abr. de 2026",
    unread: 0,
  },
];

const initialMessagesByConversation: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      sender: "client",
      text: "Bom dia, tudo bem? Posso ir?",
      time: "11h45",
    },
    {
      id: "m2",
      sender: "me",
      text: "Claro, chego em 30 minutos",
      time: "12h22",
      read: true,
    },
    {
      id: "m3",
      sender: "client",
      text: "Estou a caminho...",
      time: "13h33",
    },
  ],
};

function loadSavedConversations() {
  if (typeof window === "undefined") {
    return initialConversations;
  }

  const savedConversations = localStorage.getItem("domi:conversations");

  if (!savedConversations) {
    return initialConversations;
  }

  try {
    const parsedConversations = JSON.parse(
      savedConversations,
    ) as Conversation[];

    if (Array.isArray(parsedConversations) && parsedConversations.length > 0) {
      return parsedConversations;
    }
  } catch {
    // Ignore invalid localStorage data and keep defaults.
  }

  return initialConversations;
}

function loadSavedMessages() {
  if (typeof window === "undefined") {
    return initialMessagesByConversation;
  }

  const savedMessages = localStorage.getItem("domi:messages");

  if (!savedMessages) {
    return initialMessagesByConversation;
  }

  try {
    const parsedMessages = JSON.parse(savedMessages) as Record<
      string,
      Message[]
    >;

    if (parsedMessages && typeof parsedMessages === "object") {
      return parsedMessages;
    }
  } catch {
    // Ignore invalid localStorage data and keep defaults.
  }

  return initialMessagesByConversation;
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "me";
  const hasText = message.text.trim().length > 0;
  const hasAttachment = Boolean(message.attachmentName);
  const isPngAttachment = message.attachmentMimeType === "image/png";

  const formatAttachmentSize = (size?: number) => {
    if (!size) {
      return "Arquivo";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      {/* Wrapper de alinhamento da bolha (esquerda/direita) */}
      <div
        className={`message-row ${isMe ? "message-row--me" : "message-row--client"}`}
      >
        {/* Container com largura maxima da mensagem */}
        <div className="message-bubble-wrap">
          {/* Linha superior com avatar e horario */}
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
            <span className="message-meta__time">{message.time}</span>
          </div>

          {/* Caixa da mensagem */}
          <div
            className={`message-bubble ${isMe ? "message-bubble--me" : "message-bubble--client"}`}
          >
            {hasText ? (
              <p className="message-bubble__text">{message.text}</p>
            ) : null}
            {hasAttachment ? (
              <a
                href={message.attachmentDataUrl || "#"}
                download={message.attachmentName}
                className={`message-attachment ${hasText ? "message-attachment--with-text" : ""}`}
                onClick={(event) => {
                  if (!message.attachmentDataUrl) {
                    event.preventDefault();
                  }
                }}
              >
                {isPngAttachment && message.attachmentDataUrl ? (
                  <Image
                    src={message.attachmentDataUrl}
                    alt={message.attachmentName || "Imagem anexada"}
                    width={320}
                    height={220}
                    unoptimized
                    className="message-attachment__preview"
                  />
                ) : null}
                <p className="message-attachment__name">
                  {message.attachmentName}
                </p>
                <p className="message-attachment__size">
                  {formatAttachmentSize(message.attachmentSize)}
                  {message.attachmentDataUrl ? " - clique para baixar" : ""}
                </p>
              </a>
            ) : null}
            {message.read && isMe ? (
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
    </>
  );
}

function IconButton({ iconSrc, label }: { iconSrc: string; label: string }) {
  return (
    <button type="button" aria-label={label} className="icon-button">
      <Image src={iconSrc} alt="" width={18} height={18} aria-hidden="true" />
    </button>
  );
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversationList, setConversationList] =
    useState<Conversation[]>(initialConversations);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(
    initialMessagesByConversation,
  );
  const [selectedConversation, setSelectedConversation] = useState(
    initialConversations[0]?.id ?? "",
  );
  const [filter, setFilter] = useState<"Todas" | "Não lidas">("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: number;
    mimeType: string;
    dataUrl: string;
  } | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasLoadedStorageRef = useRef(false);

  const formatTime = (date: Date) => {
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${hour}h${minute}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedConversations = loadSavedConversations();
      const savedMessages = loadSavedMessages();

      setConversationList(savedConversations);
      setMessagesMap(savedMessages);
      setSelectedConversation((previousSelected) => {
        if (
          previousSelected &&
          savedConversations.some(
            (conversation) => conversation.id === previousSelected,
          )
        ) {
          return previousSelected;
        }

        return savedConversations[0]?.id ?? "";
      });

      hasLoadedStorageRef.current = true;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStorageRef.current) {
      return;
    }

    localStorage.setItem(
      "domi:conversations",
      JSON.stringify(conversationList),
    );
  }, [conversationList]);

  useEffect(() => {
    if (!hasLoadedStorageRef.current) {
      return;
    }

    localStorage.setItem("domi:messages", JSON.stringify(messagesMap));
  }, [messagesMap]);

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();

    if ((!trimmedMessage && !attachedFile) || !selectedConversation) {
      return;
    }

    const now = new Date();
    const createdMessage: Message = {
      id: `${selectedConversation}-${Date.now()}`,
      sender: "me",
      text: trimmedMessage,
      time: formatTime(now),
      read: true,
      attachmentName: attachedFile?.name,
      attachmentSize: attachedFile?.size,
      attachmentMimeType: attachedFile?.mimeType,
      attachmentDataUrl: attachedFile?.dataUrl,
    };

    setMessagesMap((previousMessages) => ({
      ...previousMessages,
      [selectedConversation]: [
        ...(previousMessages[selectedConversation] ?? []),
        createdMessage,
      ],
    }));

    setConversationList((previousConversations) =>
      previousConversations.map((conversation) =>
        conversation.id === selectedConversation
          ? {
              ...conversation,
              preview:
                trimmedMessage || `Arquivo: ${attachedFile?.name ?? "anexo"}`,
              time: formatTime(now),
              date: formatDate(now),
              unread: 0,
            }
          : conversation,
      ),
    );

    setNewMessage("");
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const selectedConv = useMemo(
    () =>
      conversationList.find(
        (conversation) => conversation.id === selectedConversation,
      ) ?? conversationList[0],
    [conversationList, selectedConversation],
  );

  const visibleConversations = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return conversationList.filter((conversation) => {
      const matchUnread = filter !== "Não lidas" || conversation.unread > 0;
      const matchSearch =
        normalizedQuery.length === 0 ||
        `${conversation.name} ${conversation.role} ${conversation.location ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchUnread && matchSearch;
    });
  }, [conversationList, filter, searchQuery]);

  const selectedMessages = messagesMap[selectedConversation] ?? [];

  const handleToggleSearch = () => {
    setIsSearchOpen((previousState) => {
      const nextState = !previousState;

      if (!nextState) {
        setSearchQuery("");
      }

      return nextState;
    });
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleAttachFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        return;
      }

      setAttachedFile({
        name: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.type,
        dataUrl: result,
      });
      messageInputRef.current?.focus();
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    router.push("/home");
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [selectedConversation, selectedMessages.length]);

  return (
    <>
      {/* Container raiz da pagina de mensagens */}
      <div className="messages-page">
        <header className="messages-header">
          {/* Bloco da logo no topo */}
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

          <div className="messages-header__back" onClick={handleBack}>
            ← Voltar
          </div>
        </header>

        <main className="messages-main">
          <aside className="messages-sidebar">
            {/* Cabecalho da lista lateral */}
            <div className="messages-sidebar__header">
              {/* Linha com titulo e botoes de acao */}
              <div className="messages-sidebar__title-row">
                <h1 className="messages-sidebar__title">Mensagens</h1>
                {/* Grupo de botoes de acao (buscar/arquivar) */}
                <div className="messages-sidebar__actions">
                  <button
                    type="button"
                    onClick={handleToggleSearch}
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

              {/* Campo de pesquisa de contatos */}
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
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Pesquisar"
                    className="messages-sidebar__search-input"
                  />
                </div>
              ) : null}

              {/* Area de filtros da lista de conversas */}
              <div className="messages-sidebar__filters">
                {(["Todas", "Não lidas"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFilter(option === "Não lidas" ? "Não lidas" : "Todas")
                    }
                    className={`messages-sidebar__filter-btn ${
                      (option === "Não lidas" ? "Não lidas" : "Todas") ===
                      filter
                        ? "messages-sidebar__filter-btn--active"
                        : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista rolavel de conversas */}
            <div className="messages-sidebar__list scrollbar-hidden">
              {visibleConversations.map((conversation) => {
                const isSelected = conversation.id === selectedConversation;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversation(conversation.id)}
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

                    {/* Bloco central com dados da conversa */}
                    <div className="messages-conversation-item__content">
                      {/* Linha com nome e papel do contato */}
                      <div className="messages-conversation-item__name-row">
                        <span className="messages-conversation-item__name">
                          {conversation.name}
                        </span>
                        <span className="messages-conversation-item__separator">
                          -
                        </span>
                        <span className="messages-conversation-item__role">
                          {conversation.role}
                        </span>
                      </div>

                      <p className="messages-conversation-item__preview">
                        {conversation.preview}
                      </p>

                      {/* Linha inferior com data e indicador de nao lidas */}
                      <div className="messages-conversation-item__meta">
                        <span className="messages-conversation-item__date">
                          {conversation.date}
                        </span>
                        {conversation.unread > 0 ? (
                          <span className="messages-conversation-item__unread">
                            {conversation.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <span className="messages-conversation-item__time">
                      {conversation.time}
                    </span>
                  </button>
                );
              })}

              {/* Rodape da lista lateral */}
              <div className="messages-sidebar__end">
                ...
                <br />
                Parece que voce chegou ao fim!
              </div>
            </div>
          </aside>

          <section className="messages-chat">
            {/* Cabecalho da conversa ativa */}
            <div className="messages-chat__header">
              {/* Bloco com avatar e informacoes do contato */}
              <div className="messages-chat__contact">
                <Image
                  src="/images/fotoPerfil.svg"
                  alt="Perfil"
                  width={55}
                  height={55}
                  className="messages-chat__contact-avatar"
                />
                {/* Nome e subtitulo do contato */}
                <div className="messages-chat__contact-info">
                  <h2 className="messages-chat__contact-name">
                    {selectedConv.name}
                  </h2>
                  <p className="messages-chat__contact-role">
                    {selectedConv.role}
                    {selectedConv.location ? ` - ${selectedConv.location}` : ""}
                  </p>
                </div>
              </div>

              <button type="button" className="messages-chat__project-button">
                Mostrar projeto
              </button>
            </div>

            {/* Area principal das mensagens */}
            <div
              ref={messageListRef}
              className="messages-chat__messages scrollbar-hidden"
            >
              {/* Marcador de data da conversa */}
              <div className="messages-chat__date-divider">25 abr. de 2026</div>

              {/* Coluna com as bolhas renderizadas */}
              <div className="messages-chat__message-column">
                {selectedMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </div>

            {/* Rodape do chat com campo de digitacao */}
            <div className="messages-chat__composer-wrap">
              {/* Barra arredondada de composicao da mensagem */}
              <div className="messages-chat__composer">
                <button
                  type="button"
                  aria-label="Anexar"
                  onClick={handleOpenFilePicker}
                  className="composer__attach-button"
                >
                  <Image
                    src="/images/link.svg"
                    alt="Anexar"
                    width={28}
                    height={28}
                  />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleAttachFile}
                  className="composer__file-input"
                />

                <input
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Escreva uma mensagem..."
                  className="composer__input"
                />

                {attachedFile ? (
                  <div className="composer__attached-file">
                    <span className="composer__attached-file-name">
                      {attachedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      aria-label="Remover anexo"
                      className="composer__remove-attachment"
                    >
                      x
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleSendMessage}
                  aria-label="Enviar"
                  className="composer__send-button"
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
