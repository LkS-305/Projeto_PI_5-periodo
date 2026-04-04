import { IAutenticacaoRepository } from '../../src/core/repositories/IAutenticacaoRepository';
import { User } from '../../src/core/entities/User';
import { LoginDto, LoginResponseDto } from '../../src/core/dtos/autenticacao';

export class InMemoryAutenticacaoRepository implements IAutenticacaoRepository {
  private usuarios: User[] = [];

  // 1. REGISTER
  async register(usuario: User): Promise<Omit<User, 'senha'>> {
    this.usuarios.push(usuario);
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  }

  // 2. LOGIN
  async login(props: LoginDto): Promise<User | null> {
    return this.usuarios.find(u => u.email === props.email) || null;
  }

  // 3. FORGOT PASSWORD (O método que faltava na implementação)
  // Ele procura o utilizador pelo e-mail e atualiza o token de recuperação
  async forgotPassword(email: string, codigo: string, expiracao: Date): Promise<void> {
    const index = this.usuarios.findIndex(u => u.email === email);
    
    if (index !== -1) {
      this.usuarios[index].recovery_token = codigo;
      this.usuarios[index].recovery_token_expires = expiracao;
    }
  }

  // 4. UPDATE RECOVERY TOKEN (Caso a tua interface também peça este pelo ID)
  async updateRecoveryToken(
    usuario_id: string, 
    codigo: string | null, 
    expiracao: Date | null
  ): Promise<void> {
    const index = this.usuarios.findIndex(u => u.id === usuario_id);
    if (index !== -1) {
      this.usuarios[index].recovery_token = codigo!;
      this.usuarios[index].recovery_token_expires = expiracao!;
    }
  }

  // 5. CHANGE PASSWORD
  async changePassword(id: string, nova_senha_hash: string): Promise<void> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios[index].senha = nova_senha_hash;
    }
  }
}
