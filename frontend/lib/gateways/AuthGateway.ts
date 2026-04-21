import { HttpClient } from '../api/client'; 
import { apiServer } from '../api/server';
import { User, AuthResponse } from '../../core/domain/User';

export const AuthGateway = {
  
  // Chamada no Servidor (para carregar o perfil logado no carregamento da página)
  async getMeServer(): Promise<User> {
    return apiServer.get<User>('/users/me');
  },

  // Chamada no Cliente (para o formulário de login)
  async loginClient(email: string, senha: string): Promise<AuthResponse> {
    return HttpClient.post<AuthResponse>('/login', { email, senha });
  },

  // Cadastro de novo usuário
  async registerClient(dados: Partial<User> & { senha: string }): Promise<User> {
    return HttpClient.post<User>('/users', dados);
  }
};
