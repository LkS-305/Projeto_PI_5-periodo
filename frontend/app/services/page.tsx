"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";
import { getAllServicos, getServicoStats, ServicoStats } from "@/lib/use-cases/servico";
import { Servico } from "@/types/entities/servico";

const CATEGORY_ICONS: Record<string, string> = {
  Cabelo: "✂️",
  Unhas: "💅",
  Barba: "🪒",
  Limpeza: "🧹",
  Encanador: "🔧",
  "Manutenção Elétrica": "⚡",
  "TI e Suporte": "💻",
  "Aulas Particulares": "📚",
  "Beleza e Estética": "💄",
};

export default function ServicesPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [stats, setStats] = useState<ServicoStats | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getAllServicos(), getServicoStats()])
      .then(([s, st]) => { setServicos(s); setStats(st); })
      .catch((err) => setError(err.message ?? "Erro ao carregar serviços"))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(servicos.map((s) => s.categoria))),
  ];

  const filtered =
    categoryFilter === "all"
      ? servicos
      : servicos.filter((s) => s.categoria === categoryFilter);

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title="Meus Serviços"
          description="Gerencie seu catálogo de serviços, defina preços e horários, e alcance mais clientes."
          cta={
            <Link href="/services/new">
              <Button>Adicionar Serviço</Button>
            </Link>
          }
        />

        <div className="grid gap-6 md:grid-cols-4">
          <StatCard title="Serviços ativos" value={stats ? String(stats.ativos) : "—"} accent="blue">
            Publicados e disponíveis
          </StatCard>
          <StatCard title="Esta semana" value={stats ? String(stats.agendamentos_semana) : "—"} accent="green">
            Agendamentos realizados
          </StatCard>
          <StatCard title="Receita mensal" value={stats ? `R$ ${Number(stats.receita_mensal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"} accent="purple">
            Faturamento total
          </StatCard>
          <StatCard title="Avaliação média" value={stats?.avaliacao_media ?? "—"} accent="yellow">
            ⭐ Baseada em {servicos.reduce((acc, s) => acc + (s.total_avaliacoes ?? 0), 0)} reviews
          </StatCard>
        </div>

        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Catálogo de serviços
              </h2>
              <p className="text-sm text-slate-600">
                Organize e gerencie suas ofertas
              </p>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === "all" ? "Todos" : category}
                </Button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="mt-12 text-center text-slate-500">
              Carregando serviços...
            </div>
          )}

          {error && (
            <div className="mt-12 text-center text-red-500">{error}</div>
          )}

          {!loading && !error && (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((servico) => (
                <div
                  key={servico.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 p-8">
                    <div className="flex h-full items-center justify-center text-6xl">
                      {servico.imagem ?? CATEGORY_ICONS[servico.categoria] ?? "🛠️"}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
                          {servico.titulo}
                        </h3>
                        {servico.descricao && (
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                            {servico.descricao}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          servico.ativo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {servico.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        {servico.nota != null ? (
                          <>
                            <span>⭐</span>
                            <span className="font-medium">{servico.nota}</span>
                            {servico.total_avaliacoes != null && (
                              <span>({servico.total_avaliacoes})</span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400">Sem avaliação</span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900">
                          R$ {Number(servico.preco_acordado).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">{servico.duracao}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" variant="secondary" className="flex-1">
                        Duplicar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="mt-12 text-center">
              <div className="mx-auto h-24 w-24 text-slate-400">🔍</div>
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                Nenhum serviço encontrado
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {categoryFilter === "all"
                  ? "Você ainda não criou nenhum serviço."
                  : `Nenhum serviço na categoria "${categoryFilter}".`}
              </p>
              <div className="mt-6">
                <Link href="/services/new">
                  <Button>Criar primeiro serviço</Button>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  );
}
