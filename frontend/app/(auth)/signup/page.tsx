"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useSession } from "@/lib/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, loading, error } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem.");
      return;
    }

    const user = await signup({ nome: name, email, password, telefone: phone });
    if (user) {
      router.push("/dashboard");
      return;
    }

    setLocalError(
      "Falha ao criar conta. Verifique os dados e tente novamente.",
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <PageHeader
        title="Comece agora"
        description="Crie sua conta no ServiçoHub para gerenciar seus serviços e clientes em um único painel inteligente."
      />

      <Container className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Registro rápido
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Abra sua conta
          </h2>
        </div>

        {(localError || error) && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-6">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Maria Silva"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            required
          />

          <Input
            label="Telefone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já possui uma conta?{" "}
          <a
            href="/login"
            className="font-medium text-slate-900 hover:text-slate-700"
          >
            Entrar
          </a>
        </p>
      </Container>
    </div>
  );
}
