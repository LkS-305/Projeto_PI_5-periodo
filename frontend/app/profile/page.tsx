'use client';

import { Layout, Container } from '@/components/Layout';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Layout>
      <Container>
        <h1 className="text-4xl font-bold mb-6">Meu Perfil</h1>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <p className="mb-2">
            <strong>Nome:</strong> {user?.nome}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="mb-2">
            <strong>Telefone:</strong> {user?.telefone || 'Não informado'}
          </p>
          <p className="mb-2">
            <strong>Membro desde:</strong> {new Date(user?.dataCriacao || '').toLocaleDateString('pt-BR')}
          </p>
        </div>
      </Container>
    </Layout>
  );
}
