"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Container } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useSession } from "@/lib/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading, error } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError("");

    const user = await login({ email, password });
    if (user) {
      router.push("/dashboard");
      return;
    }

    setLocalError("Verifique suas credenciais e tente novamente.");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <PageHeader
        title="Acesse sua conta"
        description="Entre no ServiçoHub para gerenciar seus serviços, agendamentos e avaliações com mais transparência e profissionalismo."
      />

      <Container className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Bem-vindo de volta
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Faça login na sua conta
          </h2>
        </div>

        {(localError || error) && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-6">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <a
            href="/signup"
            className="font-medium text-slate-900 hover:text-slate-700"
          >
            Crie sua conta
          </a>
        </p>
      </Container>
    </div>
  );
}
