'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container } from '@/components/Layout';
import Link from 'next/link';
import client from '@/lib/api/client';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    setLoading(true);

    try {
      await client.post('/auth/signup', {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone,
      });

      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    }

    setLoading(false);
  }

  return (
    <Container className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">Cadastro</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome completo"
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Telefone"
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
        />

        <Input
          label="Senha"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirmar senha"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          Cadastrar
        </Button>
      </form>

      <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
        Já tem conta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Faça login
        </Link>
      </p>
    </Container>
  );
}
