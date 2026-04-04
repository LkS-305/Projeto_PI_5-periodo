"use client";

import { useState } from "react";
import { Layout, Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useSession } from "@/lib/contexts/AuthContext";

export default function ProfilePage() {
  const { user, updateUser } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    bio: "Profissional experiente em cuidados pessoais, especializado em cortes modernos e técnicas de barbearia tradicional.",
    especialidades: ["Corte de Cabelo", "Barba", "Bigode"],
    experiencia: "5 anos",
    localizacao: "São Paulo, SP",
  });

  const handleSave = async () => {
    await updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nome: user?.nome || "",
      email: user?.email || "",
      telefone: user?.telefone || "",
      bio: "Profissional experiente em cuidados pessoais, especializado em cortes modernos e técnicas de barbearia tradicional.",
      especialidades: ["Corte de Cabelo", "Barba", "Bigode"],
      experiencia: "5 anos",
      localizacao: "São Paulo, SP",
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <PageHeader
          title="Meu Perfil"
          description="Gerencie suas informações pessoais, especialidades e configurações da conta."
          cta={
            isEditing ? (
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
            )
          }
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Container>
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl text-white mb-4">
                  👨‍💼
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user?.nome}
                </h2>
                <p className="text-slate-600">Profissional de Beleza</p>
                <div className="mt-4 flex justify-center gap-4 text-sm text-slate-600">
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">4.8</p>
                    <p>⭐ Avaliação</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">156</p>
                    <p>Clientes</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-slate-900">5</p>
                    <p>Anos</p>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Container>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Informações Pessoais
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome completo"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <Input
                  label="Localização"
                  value={formData.localizacao}
                  onChange={(e) =>
                    setFormData({ ...formData, localizacao: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </Container>

            <Container>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Sobre Mim
              </h3>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
                  rows={4}
                  placeholder="Conte um pouco sobre você e sua experiência..."
                />
              ) : (
                <p className="text-slate-700">{formData.bio}</p>
              )}
            </Container>

            <Container>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Especialidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.especialidades.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Container>

            <Container>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Estatísticas
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">156</p>
                  <p className="text-sm text-slate-600">Clientes atendidos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">98%</p>
                  <p className="text-sm text-slate-600">Satisfação</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">R$ 12.450</p>
                  <p className="text-sm text-slate-600">Faturamento mensal</p>
                </div>
              </div>
            </Container>

            <Container>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Configurações da Conta
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      Notificações por email
                    </p>
                    <p className="text-sm text-slate-600">
                      Receber atualizações sobre agendamentos
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Perfil público</p>
                    <p className="text-sm text-slate-600">
                      Permitir que clientes vejam seu perfil
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  );
}
