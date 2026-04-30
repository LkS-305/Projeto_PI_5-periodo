import { apiClient } from '../api/client'; 
import { AuthResponse, RegisterDto, LoginDto } from '../../types/dtos/user';

export const AuthGateway = {
  
  // Chamada no Servidor (para carregar o perfil logado no carregamento da página)

  // Chamada no Cliente (para o formulário de login)
  async loginClient(dados: LoginDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/user/login', dados);
  },

  // Cadastro de novo usuário
  async registerClient(dados: RegisterDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/user/register', dados);
  },
};
