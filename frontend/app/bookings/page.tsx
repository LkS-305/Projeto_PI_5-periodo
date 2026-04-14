"use client";

import { useState } from "react";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";

export default function BookingsPage() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const mockBookings = [
    {
      id: "1",
      service: "Corte de Cabelo Masculino",
      client: "João Silva",
      date: "2024-01-15",
      time: "14:00",
      status: "confirmed",
      price: 45.0,
      duration: 60,
    },
    {
      id: "2",
      service: "Manicure e Pedicure",
      client: "Maria Santos",
      date: "2024-01-16",
      time: "10:30",
      status: "pending",
      price: 80.0,
      duration: 90,
    },
    {
      id: "3",
      service: "Barba Completa",
      client: "Pedro Oliveira",
      date: "2024-01-14",
      time: "16:00",
      status: "completed",
      price: 35.0,
      duration: 45,
    },
  ];

  const filteredBookings = mockBookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "confirmed":
        return "Confirmado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title="Agendamentos"
          description="Gerencie seus compromissos, confirme horários e acompanhe o status dos serviços agendados."
        />

        <div className="grid gap-6 md:grid-cols-4">
          <StatCard title="Hoje" value="3" accent="blue">
            Agendamentos para hoje
          </StatCard>
          <StatCard title="Esta semana" value="12" accent="green">
            Agendamentos confirmados
          </StatCard>
          <StatCard title="Pendentes" value="2" accent="yellow">
            Aguardando confirmação
          </StatCard>
          <StatCard title="Cancelados" value="1" accent="red">
            Últimos 30 dias
          </StatCard>
        </div>

        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Próximos agendamentos
              </h2>
              <p className="text-sm text-slate-600">
                Organize e gerencie seus compromissos
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { key: "all", label: "Todos" },
                { key: "pending", label: "Pendentes" },
                { key: "confirmed", label: "Confirmados" },
                { key: "completed", label: "Concluídos" },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={filter === key ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(key as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {booking.service}
                      </h3>
                      <p className="text-sm text-slate-600">{booking.client}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                    <span>
                      📅 {new Date(booking.date).toLocaleDateString("pt-BR")}
                    </span>
                    <span>🕐 {booking.time}</span>
                    <span>⏱️ {booking.duration}min</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">
                      R$ {booking.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <Button size="sm" variant="primary">
                          Confirmar
                        </Button>
                        <Button size="sm" variant="secondary">
                          Recusar
                        </Button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <Button size="sm" variant="secondary">
                        Reagendar
                      </Button>
                    )}
                    <Button size="sm" variant="secondary">
                      Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="mt-12 text-center">
              <div className="mx-auto h-24 w-24 text-slate-400">📅</div>
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                Nenhum agendamento encontrado
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {filter === "all"
                  ? "Você ainda não tem agendamentos."
                  : `Nenhum agendamento ${filter === "pending" ? "pendente" : filter === "confirmed" ? "confirmado" : filter === "completed" ? "concluído" : "cancelado"}.`}
              </p>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
}
