"use client";

import { useState } from "react";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";

export default function WalletPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const mockTransactions = [
    {
      id: "1",
      type: "credit",
      description: "Pagamento - Corte de Cabelo Masculino",
      amount: 45.0,
      date: "2024-01-15",
      status: "completed",
      client: "João Silva",
    },
    {
      id: "2",
      type: "credit",
      description: "Pagamento - Manicure e Pedicure",
      amount: 80.0,
      date: "2024-01-14",
      status: "completed",
      client: "Maria Santos",
    },
    {
      id: "3",
      type: "debit",
      description: "Saque para conta bancária",
      amount: -200.0,
      date: "2024-01-13",
      status: "completed",
      client: null,
    },
    {
      id: "4",
      type: "credit",
      description: "Pagamento - Barba Completa",
      amount: 35.0,
      date: "2024-01-12",
      status: "pending",
      client: "Pedro Oliveira",
    },
    {
      id: "5",
      type: "credit",
      description: "Pagamento - Coloração Capilar",
      amount: 120.0,
      date: "2024-01-10",
      status: "completed",
      client: "Ana Costa",
    },
  ];

  const balance = 3450.0;
  const available = 3200.0;
  const pending = 250.0;

  const getTransactionIcon = (type: string) => {
    return type === "credit" ? "💰" : "💸";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title="Carteira Digital"
          description="Acompanhe seu saldo, histórico de transações e faça saques de forma segura e rápida."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-4xl border border-slate-200/80 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Saldo Total</p>
                <p className="text-3xl font-bold text-blue-900">
                  R$ {balance.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200/80 bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Disponível</p>
                <p className="text-3xl font-bold text-green-900">
                  R$ {available.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200/80 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Pendente</p>
                <p className="text-3xl font-bold text-yellow-900">
                  R$ {pending.toFixed(2)}
                </p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Container>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Histórico de transações
                  </h2>
                  <p className="text-sm text-slate-600">
                    Últimas movimentações da sua conta
                  </p>
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "7d", label: "7 dias" },
                    { key: "30d", label: "30 dias" },
                    { key: "90d", label: "90 dias" },
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={period === key ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => setPeriod(key as any)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(transaction.date).toLocaleDateString(
                            "pt-BR",
                          )}
                          {transaction.client && ` • ${transaction.client}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : ""}R${" "}
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status === "completed"
                          ? "Concluído"
                          : transaction.status === "pending"
                            ? "Pendente"
                            : "Falhou"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </div>

          <div className="space-y-6">
            <Container>
              <h3 className="text-lg font-semibold text-slate-900">
                Ações rápidas
              </h3>
              <div className="mt-4 space-y-3">
                <Button className="w-full justify-start" variant="primary">
                  💸 Solicitar saque
                </Button>
                <Button className="w-full justify-start" variant="secondary">
                  📊 Relatório financeiro
                </Button>
                <Button className="w-full justify-start" variant="secondary">
                  🔄 Transferir saldo
                </Button>
                <Button className="w-full justify-start" variant="secondary">
                  💳 Adicionar cartão
                </Button>
              </div>
            </Container>

            <Container>
              <h3 className="text-lg font-semibold text-slate-900">
                Resumo mensal
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Receitas</span>
                  <span className="font-medium text-green-600">
                    R$ 2.340,00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Saques</span>
                  <span className="font-medium text-red-600">R$ 800,00</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-slate-900">
                    Lucro líquido
                  </span>
                  <span className="font-semibold text-slate-900">
                    R$ 1.540,00
                  </span>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  );
}
