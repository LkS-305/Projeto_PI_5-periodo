"use client";

import { useState } from "react";
import Link from "next/link";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { StatCard } from "@/components/StatCard";

export default function ServicesPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const mockServices = [
    {
      id: "1",
      title: "Corte de Cabelo Masculino Completo",
      description:
        "Corte moderno com acabamento profissional, lavagem e finalização.",
      category: "Cabelo",
      price: 45.0,
      duration: 60,
      rating: 4.8,
      reviews: 24,
      active: true,
      image: "✂️",
    },
    {
      id: "2",
      title: "Manicure e Pedicure Spa",
      description:
        "Tratamento completo para unhas com esmaltação e massagem relaxante.",
      category: "Unhas",
      price: 80.0,
      duration: 90,
      rating: 4.9,
      reviews: 18,
      active: true,
      image: "💅",
    },
    {
      id: "3",
      title: "Barba Completa com Design",
      description:
        "Aparação, modelagem e finalização da barba com produtos premium.",
      category: "Barba",
      price: 35.0,
      duration: 45,
      rating: 4.7,
      reviews: 31,
      active: false,
      image: "🪒",
    },
    {
      id: "4",
      title: "Coloração Capilar Profissional",
      description:
        "Coloração completa ou mechas com produtos de alta qualidade.",
      category: "Cabelo",
      price: 120.0,
      duration: 180,
      rating: 4.6,
      reviews: 12,
      active: true,
      image: "🎨",
    },
  ];

  const categories = [
    "all",
    ...Array.from(new Set(mockServices.map((s) => s.category))),
  ];

  const filteredServices =
    categoryFilter === "all"
      ? mockServices
      : mockServices.filter((service) => service.category === categoryFilter);

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
          <StatCard title="Serviços ativos" value="12" accent="blue">
            Publicados e disponíveis
          </StatCard>
          <StatCard title="Esta semana" value="8" accent="green">
            Agendamentos realizados
          </StatCard>
          <StatCard title="Receita mensal" value="R$ 2.340" accent="purple">
            Faturamento total
          </StatCard>
          <StatCard title="Avaliação média" value="4.8" accent="yellow">
            ⭐ Baseada em 156 reviews
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
                  variant={
                    categoryFilter === category ? "primary" : "secondary"
                  }
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                >
                  {category === "all" ? "Todos" : category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-lg"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 p-8">
                  <div className="flex h-full items-center justify-center text-6xl">
                    {service.image}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        service.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {service.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <span>⭐</span>
                      <span className="font-medium">{service.rating}</span>
                      <span>({service.reviews})</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900">
                        R$ {service.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {service.duration}min
                      </p>
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

          {filteredServices.length === 0 && (
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
