'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { Layout, Container, Card } from '@/components/Layout';
import { Button } from '@/components/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Bem-vindo, {user?.nome}!
          </h1>
          <Button variant="secondary" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Serviços" className="text-center">
          <p className="text-3xl font-bold text-blue-600 mb-4">0</p>
          <Link href="/services">
            <Button variant="primary" size="sm" className="w-full">
              Ver Serviços
            </Button>
          </Link>
        </Card>

        <Card title="Agendamentos" className="text-center">
          <p className="text-3xl font-bold text-green-600 mb-4">0</p>
          <Link href="/bookings">
            <Button variant="primary" size="sm" className="w-full">
              Ver Agendamentos
            </Button>
          </Link>
        </Card>

        <Card title="Saldo" className="text-center">
          <p className="text-3xl font-bold text-purple-600 mb-4">R$ 0.00</p>
          <Link href="/wallet">
            <Button variant="primary" size="sm" className="w-full">
              Ver Carteira
            </Button>
          </Link>
        </Card>
      </div>

      <Container>
        <h2 className="text-2xl font-bold mb-4">Atalhos Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/profile">
            <Button variant="secondary" className="w-full text-left">
              📝 Editar Perfil
            </Button>
          </Link>
          <Link href="/services?new=true">
            <Button variant="secondary" className="w-full text-left">
              ➕ Novo Serviço
            </Button>
          </Link>
          <Link href="/messages">
            <Button variant="secondary" className="w-full text-left">
              💬 Mensagens
            </Button>
          </Link>
          <Link href="/ratings">
            <Button variant="secondary" className="w-full text-left">
              ⭐ Avaliações
            </Button>
          </Link>
        </div>
      </Container>
    </Layout>
  );
}
