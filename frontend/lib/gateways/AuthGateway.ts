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

  // Verifica se um e-mail já está cadastrado
  async verificarEmail(email: string): Promise<{ existe: boolean }> {
    return apiClient.post<{ existe: boolean }>('/user/verificarEmail', { email });
  },

  /** Recuperação de senha: envia código de 6 dígitos por e-mail (rota pública). */
  async solicitarRecuperacaoSenha(email: string): Promise<void> {
    await apiClient.post('/user/forgotPassword', { email });
  },

  /** Redefine a senha com o código recebido por e-mail. */
  async redefinirSenhaComCodigo(payload: {
    email: string;
    codigo: string;
    nova_senha: string;
  }): Promise<void> {
    await apiClient.post('/user/changeForgotPassword', payload);
  },

  /** Cadastro: envia código de 4 dígitos para o e-mail (antes de criar a conta). */
  async enviarCodigoCadastro(email: string): Promise<void> {
    await apiClient.post('/user/enviarCodigoCadastro', { email });
  },

  async confirmarCodigoCadastro(email: string, codigo: string): Promise<void> {
    await apiClient.post('/user/confirmarCodigoCadastro', { email, codigo });
  },
};
