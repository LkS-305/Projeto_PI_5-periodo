"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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
};

const conversations: Conversation[] = [
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

const messagesByConversation: Record<string, Message[]> = {
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

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.sender === "me";

  return (
    <>
      {/* Wrapper de alinhamento da bolha (esquerda/direita) */}
      <div className={`mb-7 flex ${isMe ? "justify-end" : "justify-start"}`}>
        {/* Container com largura maxima da mensagem */}
        <div className="inline-flex max-w-[75%] flex-col md:max-w-[62%]">
          {/* Linha superior com avatar e horario */}
          <div
            className={`mb-1.5 flex items-center justify-between px-1 ${
              isMe ? "flex-row-reverse" : ""
            }`}
          >
            <Image
              src="/images/fotoPerfil.svg"
              alt="Perfil"
              width={16}
              height={16}
            />
            <span className="text-[11px] text-[#888888]">{message.time}</span>
          </div>

          {/* Caixa da mensagem */}
          <div
            className={`relative inline-block w-fit max-w-full rounded-[20px] bg-[#D9D9D9] px-5 py-4 text-[20px] font-normal text-[#272727] ${
              isMe ? "rounded-br-[6px]" : "rounded-bl-[6px]"
            }`}
          >
            {message.text}
            {message.read && isMe ? (
              <Image
                src="/images/Visto.svg"
                alt="Lida"
                width={16}
                height={16}
                className="absolute bottom-2 right-3"
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
    <button
      type="button"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-[#E0C271] bg-[#E0C271] text-white transition hover:opacity-85"
    >
      <Image src={iconSrc} alt="" width={18} height={18} aria-hidden="true" />
    </button>
  );
}

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [filter, setFilter] = useState<"Todas" | "Não lidas">("Todas");
  const [newMessage, setNewMessage] = useState("");

  const selectedConv = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversation,
      ) ?? conversations[0],
    [selectedConversation],
  );

  const visibleConversations = useMemo(() => {
    if (filter === "Não lidas") {
      return conversations.filter((conversation) => conversation.unread > 0);
    }

    return conversations;
  }, [filter]);

  const selectedMessages =
    messagesByConversation[selectedConversation] ?? messagesByConversation["1"];

  return (
    <>
      {/* Container raiz da pagina de mensagens */}
      <div className="flex h-screen flex-col overflow-hidden bg-[#FAF9F5] text-[#272727]">
        <header className="relative z-10 flex h-[90px] w-full items-center bg-[#E0C271]">
          {/* Bloco da logo no topo */}
          <div className="absolute left-[40px] top-[15px] z-20">
            <Image
              src="/images/logo_domi.png"
              alt="DOMI"
              width={70}
              height={60}
              priority
            />
          </div>

          <span className="ml-[130px] select-none font-['Clash_Display',sans-serif] text-[70px] font-bold leading-none tracking-[-1px] text-[#272727]">
            DOMI
          </span>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <aside className="flex w-[420px] flex-col border-r-2 border-[#E0C271] bg-[#FAF9F5]">
            {/* Cabecalho da lista lateral */}
            <div className="px-5 pb-2 pt-5">
              {/* Linha com titulo e botoes de acao */}
              <div className="mb-5 flex items-center justify-between gap-3">
                <h1 className="text-[38px] font-bold leading-none text-[#272727]">
                  Mensagens
                </h1>
                {/* Grupo de botoes de acao (buscar/arquivar) */}
                <div className="flex items-center gap-2">
                  <IconButton label="Pesquisar" iconSrc="/images/lupa2.svg" />
                  <IconButton
                    label="Arquivar"
                    iconSrc="/images/Arquivadas.svg"
                  />
                </div>
              </div>

              {/* Area de filtros da lista de conversas */}
              <div className="mb-3 flex gap-3">
                {(["Todas", "Não lidas"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFilter(option === "Não lidas" ? "Não lidas" : "Todas")
                    }
                    className={`rounded-full px-6 py-2 text-[16px] font-semibold transition ${
                      (option === "Não lidas" ? "Não lidas" : "Todas") ===
                      filter
                        ? "bg-[#272727] text-white"
                        : "border border-[#272727] bg-transparent text-[#272727]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista rolavel de conversas */}
            <div className="flex-1 overflow-y-auto border-t-2 border-[#E0C271]">
              {visibleConversations.map((conversation) => {
                const isSelected = conversation.id === selectedConversation;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`flex w-full items-start gap-3 border-b-2 border-[#E0C271] px-5 py-3 text-left transition ${
                      isSelected ? "bg-[#F3E9C9]" : "hover:bg-[#F3E9C9]"
                    }`}
                  >
                    <Image
                      src="/images/fotoPerfil.svg"
                      alt="Perfil"
                      width={45}
                      height={45}
                      className="h-[45px] w-[45px] shrink-0"
                    />

                    {/* Bloco central com dados da conversa */}
                    <div className="min-w-0 flex-1">
                      {/* Linha com nome e papel do contato */}
                      <div className="mb-1 flex items-baseline gap-1">
                        <span className="truncate font-['SF_Pro_Text',system-ui,sans-serif] text-[16px] font-medium text-[#272727]">
                          {conversation.name}
                        </span>
                        <span className="text-[12px] text-[#272727]">-</span>
                        <span className="truncate text-[16px] font-medium text-[#E0C271]">
                          {conversation.role}
                        </span>
                      </div>

                      <p className="truncate text-[14px] text-[#555555]">
                        {conversation.preview}
                      </p>

                      {/* Linha inferior com data e indicador de nao lidas */}
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-[#888888]">
                          {conversation.date}
                        </span>
                        {conversation.unread > 0 ? (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#272727] px-1.5 text-[11px] text-white">
                            {conversation.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <span className="shrink-0 text-[12px] font-medium text-[#888888]">
                      {conversation.time}
                    </span>
                  </button>
                );
              })}

              {/* Rodape da lista lateral */}
              <div className="px-5 py-8 text-center text-[14px] font-medium text-[#272727]">
                ...
                <br />
                Parece que voce chegou ao fim!
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col bg-[#FAF9F5]">
            {/* Cabecalho da conversa ativa */}
            <div className="flex items-center justify-between border-b-2 border-[#E0C271] px-8 py-5">
              {/* Bloco com avatar e informacoes do contato */}
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/images/fotoPerfil.svg"
                  alt="Perfil"
                  width={55}
                  height={55}
                  className="h-[55px] w-[55px] shrink-0"
                />
                {/* Nome e subtitulo do contato */}
                <div className="min-w-0">
                  <h2 className="truncate font-['SF_Pro_Text',system-ui,sans-serif] text-[34px] font-medium leading-none text-[#272727]">
                    {selectedConv.name}
                  </h2>
                  <p className="mt-1 truncate text-[18px] font-medium text-[#E0C271]">
                    {selectedConv.role}
                    {selectedConv.location ? ` - ${selectedConv.location}` : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-full bg-[#E0C271] px-6 py-2 text-[18px] font-semibold text-white transition hover:opacity-90"
              >
                Mostrar projeto
              </button>
            </div>

            {/* Area principal das mensagens */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              {/* Marcador de data da conversa */}
              <div className="mb-8 text-center text-[12px] font-medium text-[#888888]">
                25 abr. de 2026
              </div>

              {/* Coluna com as bolhas renderizadas */}
              <div className="flex flex-col">
                {selectedMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </div>

            {/* Rodape do chat com campo de digitacao */}
            <div className="px-8 pb-10">
              {/* Barra arredondada de composicao da mensagem */}
              <div className="flex h-[80px] items-center rounded-full bg-[#EBEBEB] px-5 shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  aria-label="Anexar"
                  className="grid h-10 w-10 place-items-center"
                >
                  <Image
                    src="/images/link.svg"
                    alt="Anexar"
                    width={28}
                    height={28}
                  />
                </button>

                <input
                  value={newMessage}
                  onChange={(event) => setNewMessage(event.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="ml-4 min-w-0 flex-1 bg-transparent text-[24px] text-[#333333] outline-none placeholder:text-[#777777]"
                />

                <button
                  type="button"
                  onClick={() => setNewMessage("")}
                  aria-label="Enviar"
                  className="grid h-10 w-10 place-items-center"
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
