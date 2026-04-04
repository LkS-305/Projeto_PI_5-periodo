"use client";

import { useState } from "react";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [newMessage, setNewMessage] = useState("");

  const mockConversations = [
    {
      id: "1",
      client: "João Silva",
      lastMessage: "Obrigado pelo ótimo atendimento!",
      time: "14:30",
      unread: 2,
      avatar: "👨",
    },
    {
      id: "2",
      client: "Maria Santos",
      lastMessage: "Quando posso agendar?",
      time: "12:15",
      unread: 0,
      avatar: "👩",
    },
    {
      id: "3",
      client: "Pedro Oliveira",
      lastMessage: "Perfeito! Até amanhã.",
      time: "Ontem",
      unread: 1,
      avatar: "🧔",
    },
    {
      id: "4",
      client: "Ana Costa",
      lastMessage: "Posso alterar o horário?",
      time: "2 dias",
      unread: 0,
      avatar: "👩‍🦰",
    },
  ];

  const mockMessages = [
    {
      id: "1",
      sender: "client",
      message: "Olá! Gostaria de agendar um corte de cabelo para esta semana.",
      time: "14:20",
      date: "Hoje",
    },
    {
      id: "2",
      sender: "me",
      message:
        "Olá João! Claro, temos disponibilidade na terça-feira às 14h. O que acha?",
      time: "14:22",
      date: "Hoje",
    },
    {
      id: "3",
      sender: "client",
      message: "Perfeito! Pode confirmar para mim?",
      time: "14:25",
      date: "Hoje",
    },
    {
      id: "4",
      sender: "me",
      message:
        "Confirmado! Te espero na terça-feira. Qualquer dúvida é só falar.",
      time: "14:28",
      date: "Hoje",
    },
    {
      id: "5",
      sender: "client",
      message: "Obrigado pelo ótimo atendimento!",
      time: "14:30",
      date: "Hoje",
    },
  ];

  const selectedConv = mockConversations.find(
    (c) => c.id === selectedConversation,
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would send the message
      setNewMessage("");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title="Mensagens"
          description="Converse com seus clientes, responda dúvidas e mantenha o relacionamento próximo."
        />

        <div className="grid gap-6 md:grid-cols-4">
          <StatCard title="Conversas ativas" value="8" accent="blue">
            Clientes em contato
          </StatCard>
          <StatCard title="Não lidas" value="3" accent="red">
            Mensagens pendentes
          </StatCard>
          <StatCard title="Hoje" value="12" accent="green">
            Mensagens trocadas
          </StatCard>
          <StatCard title="Tempo médio" value="2h" accent="purple">
            Para primeira resposta
          </StatCard>
        </div>

        <Container className="h-[600px] p-0">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-80 border-r border-slate-200/80">
              <div className="border-b border-slate-200/80 p-4">
                <h3 className="font-semibold text-slate-900">Conversas</h3>
              </div>
              <div className="overflow-y-auto">
                {mockConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`cursor-pointer border-b border-slate-200/50 p-4 hover:bg-slate-50 ${
                      selectedConversation === conversation.id
                        ? "bg-slate-100"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg">
                        {conversation.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900 truncate">
                            {conversation.client}
                          </p>
                          <span className="text-xs text-slate-500">
                            {conversation.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="border-b border-slate-200/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg">
                        {selectedConv.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {selectedConv.client}
                        </h3>
                        <p className="text-sm text-slate-600">Cliente ativo</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs rounded-2xl px-4 py-2 ${
                            message.sender === "me"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "me"
                                ? "text-blue-100"
                                : "text-slate-500"
                            }`}
                          >
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-slate-200/80 p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        placeholder="Digite sua mensagem..."
                        className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="rounded-full px-6"
                      >
                        📤
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-medium text-slate-900">
                      Selecione uma conversa
                    </h3>
                    <p className="text-sm text-slate-600">
                      Escolha uma conversa para começar a conversar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
