import { ForgotPasswordDto, ForgotPasswordResponseDto, ChangePasswordDto, ChangeForgotPasswordDto, LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '../dtos/autenticacao';
import { User } from '../entities/User';

export interface IAutenticacaoRepository {
  register(user: User): Promise<Omit<User, 'senha'> | null>;
  login(props: LoginDto): Promise<Omit<User, 'senha'> | null>;
  updateRecoveryToken(usuario_id: string, codigo: string | null, expiracao: Date | null): Promise<void>;
  changePassword(id: string, nova_senha: string): Promise<void>;
}
