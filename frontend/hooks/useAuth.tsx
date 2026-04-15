'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/core/domain/User';
import { AuthGateway } from '@/infra/gateways/AuthGateway';
import { api } from '@/infra/api/client';

interface AuthContextData {
  user: User | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Tenta recuperar o usuário do LocalStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('@Pi:user');
    const storedToken = localStorage.getItem('@Pi:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }
  }, []);

  async function signIn(email: string, senha: string) {
    const { user, token } = await AuthGateway.loginClient(email, senha);

    // Salva no LocalStorage para o Cliente
    localStorage.setItem('@Pi:token', token);
    localStorage.setItem('@Pi:user', JSON.stringify(user));

    // Salva nos Cookies para o Servidor (apiServer conseguir ler)
    document.cookie = `@Pi:token=${token}; path=/; max-age=86400; SameSite=Lax`;

    // Configura o Axios para os próximos requests
    api.defaults.headers.Authorization = `Bearer ${token}`;
    
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('@Pi:token');
    localStorage.removeItem('@Pi:user');
    document.cookie = "@Pi:token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
