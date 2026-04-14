"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useSession } from "@/lib/contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useSession();

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title={`Olá, ${user?.nome ?? "Profissional"}`}
          description="Gerencie serviços, agendamentos, finanças e avaliações com controle total em um único painel."
        />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-stretch">
          <div className="grid flex-1 gap-6 md:grid-cols-3">
            <StatCard title="Serviços ativos" value="12" accent="blue">
              Total de serviços publicados e disponíveis para agendamento.
            </StatCard>
            <StatCard title="Próximos agendamentos" value="5" accent="green">
              Clientes confirmados agendados para os próximos 7 dias.
            </StatCard>
            <StatCard title="Carteira" value="R$ 3.450" accent="purple">
              Total disponível para saque e histórico financeiro recente.
            </StatCard>
          </div>

          <div className="rounded-4xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-950/80 xl:max-w-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Perfil
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                  Resumo de conta
                </h3>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                Nome:{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {user?.nome ?? "—"}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {user?.email ?? "—"}
                </span>
              </p>
              <p>
                Status:{" "}
                <span className="font-medium text-emerald-700">Ativo</span>
              </p>
            </div>
          </div>
        </div>

        <Container className="rounded-4xl border border-slate-200/80 bg-slate-50/80 p-8 shadow-[0_20px_40px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-slate-950/80">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Atalhos
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Ações rápidas
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vá direto aos recursos que ajudam você a entregar serviços
              melhores.
            </p>
          </div>

          <div className="grid gap-4 py-6 sm:grid-cols-2">
            <Link href="/profile">
              <Button variant="secondary" className="w-full justify-start">
                📝 Editar Perfil
              </Button>
            </Link>
            <Link href="/services?new=true">
              <Button variant="secondary" className="w-full justify-start">
                ➕ Novo Serviço
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="secondary" className="w-full justify-start">
                💬 Mensagens
              </Button>
            </Link>
            <Link href="/ratings">
              <Button variant="secondary" className="w-full justify-start">
                ⭐ Avaliações
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
