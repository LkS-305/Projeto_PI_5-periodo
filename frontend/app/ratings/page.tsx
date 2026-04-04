"use client";

import { useState } from "react";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";

export default function RatingsPage() {
  const [filter, setFilter] = useState<"all" | "5" | "4" | "3" | "2" | "1">(
    "all",
  );

  const mockReviews = [
    {
      id: "1",
      client: "João Silva",
      service: "Corte de Cabelo Masculino",
      rating: 5,
      comment:
        "Excelente atendimento! O profissional foi muito cuidadoso e o resultado ficou perfeito. Recomendo!",
      date: "2024-01-15",
      response: null,
    },
    {
      id: "2",
      client: "Maria Santos",
      service: "Manicure e Pedicure",
      rating: 4,
      comment:
        "Muito bom serviço, mas demorou um pouco mais que o esperado. Mesmo assim, valeu a pena!",
      date: "2024-01-14",
      response:
        "Obrigado pelo feedback! Vamos trabalhar para otimizar nossos horários.",
    },
    {
      id: "3",
      client: "Pedro Oliveira",
      service: "Barba Completa",
      rating: 5,
      comment: "Sempre volto aqui. Profissionalismo e qualidade impecáveis!",
      date: "2024-01-12",
      response: null,
    },
    {
      id: "4",
      client: "Ana Costa",
      service: "Coloração Capilar",
      rating: 3,
      comment:
        "O serviço foi ok, mas esperava um resultado melhor na coloração.",
      date: "2024-01-10",
      response:
        "Lamentamos não ter atendido suas expectativas. Entre em contato para agendarmos uma correção.",
    },
  ];

  const filteredReviews =
    filter === "all"
      ? mockReviews
      : mockReviews.filter((review) => review.rating.toString() === filter);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ⭐
      </span>
    ));
  };

  const averageRating =
    mockReviews.reduce((acc, review) => acc + review.rating, 0) /
    mockReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: mockReviews.filter((r) => r.rating === stars).length,
    percentage:
      (mockReviews.filter((r) => r.rating === stars).length /
        mockReviews.length) *
      100,
  }));

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title="Avaliações & Feedback"
          description="Acompanhe sua reputação, leia comentários dos clientes e construa confiança na plataforma."
        />

        <div className="grid gap-6 md:grid-cols-4">
          <StatCard
            title="Avaliação média"
            value={averageRating.toFixed(1)}
            accent="yellow"
          >
            ⭐ Baseada em {mockReviews.length} reviews
          </StatCard>
          <StatCard
            title="5 estrelas"
            value={`${ratingDistribution[0].percentage.toFixed(0)}%`}
            accent="green"
          >
            {ratingDistribution[0].count} avaliações
          </StatCard>
          <StatCard title="Respostas" value="2" accent="blue">
            Reviews respondidas
          </StatCard>
          <StatCard title="Este mês" value="+12" accent="purple">
            Novas avaliações
          </StatCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Container>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Comentários dos clientes
                  </h2>
                  <p className="text-sm text-slate-600">
                    Feedback e avaliações recentes
                  </p>
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "Todas" },
                    { key: "5", label: "5⭐" },
                    { key: "4", label: "4⭐" },
                    { key: "3", label: "3⭐" },
                    { key: "2", label: "2⭐" },
                    { key: "1", label: "1⭐" },
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

              <div className="mt-6 space-y-6">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {review.client}
                          </span>
                          <span className="text-sm text-slate-500">•</span>
                          <span className="text-sm text-slate-500">
                            {review.service}
                          </span>
                        </div>
                        <p className="mt-3 text-slate-700">{review.comment}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(review.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {review.response && (
                      <div className="mt-4 rounded-lg bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">
                          Sua resposta:
                        </p>
                        <p className="mt-1 text-sm text-slate-700">
                          {review.response}
                        </p>
                      </div>
                    )}

                    {!review.response && (
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" variant="secondary">
                          Responder
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Container>
          </div>

          <div className="space-y-6">
            <Container>
              <h3 className="text-lg font-semibold text-slate-900">
                Distribuição das avaliações
              </h3>
              <div className="mt-4 space-y-3">
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <span>{stars}</span>
                      <span className="text-yellow-400">⭐</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">{count}</span>
                  </div>
                ))}
              </div>
            </Container>

            <Container>
              <h3 className="text-lg font-semibold text-slate-900">
                Dicas para melhorar
              </h3>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div className="flex gap-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="font-medium text-slate-900">
                      Responda rapidamente
                    </p>
                    <p>Clientes apreciam respostas em até 24h</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">📸</span>
                  <div>
                    <p className="font-medium text-slate-900">Adicione fotos</p>
                    <p>Mostre seu trabalho para atrair mais clientes</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="font-medium text-slate-900">
                      Seja específico
                    </p>
                    <p>Descreva detalhadamente seus serviços</p>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  );
}
