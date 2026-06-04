import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import {
  RegisterUseCase,
  LoginUseCase,
  DeletarUserUseCase,
  AcharPorEmail,
  AcharPorId,
  VerificarEmailExiste,
  ChangePassword,
} from '../src/core/use-cases/user/UserUseCase';
import {
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../src/core/errors/AppError';

const UUID_VALIDO = '123e4567-e89b-12d3-a456-426614174000';
const EMAIL_VALIDO = 'usuario@teste.com';
const SENHA_VALIDA = 'senha123';
const CPF_VALIDO = '12345678900';

describe('Suíte de Testes: User', () => {
  let repo: InMemoryUserRepository;

  beforeEach(() => {
    repo = new InMemoryUserRepository();
  });

  // ─── RegisterUseCase ────────────────────────────────────────────────────────

  describe('Cenário: Cadastro (Register)', () => {
    test('Deve cadastrar um novo usuário e retornar token + dados sem senha', async () => {
      const sut = new RegisterUseCase(repo);

      const resultado = await sut.executar({
        email: EMAIL_VALIDO,
        senha: SENHA_VALIDA,
        cpf: CPF_VALIDO,
      });

      expect(resultado.token).toBeTruthy();
      expect(resultado.user).toBeTruthy();
      expect(resultado.user).not.toHaveProperty('senha');
      expect(resultado.user?.email).toBe(EMAIL_VALIDO);
    });

    test('Deve lançar ResourceAlreadyExistsError ao cadastrar email duplicado', async () => {
      const sut = new RegisterUseCase(repo);
      await sut.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      await expect(
        sut.executar({ email: EMAIL_VALIDO, senha: 'outrasenha', cpf: '00000000000' })
      ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
    });

    test('Deve lançar ValidationError para email com formato inválido', async () => {
      const sut = new RegisterUseCase(repo);

      await expect(
        sut.executar({ email: 'email-invalido', senha: SENHA_VALIDA, cpf: CPF_VALIDO })
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── LoginUseCase ────────────────────────────────────────────────────────────

  describe('Cenário: Login', () => {
    test('Deve fazer login com credenciais corretas e retornar token', async () => {
      const sut = new LoginUseCase(repo);
      const register = new RegisterUseCase(repo);
      await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      const resultado = await sut.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA });

      expect(resultado.token).toBeTruthy();
      expect(resultado.user).not.toHaveProperty('senha');
      expect(resultado.user.email).toBe(EMAIL_VALIDO);
    });

    test('Deve lançar UnauthorizedError ao usar senha incorreta', async () => {
      const sut = new LoginUseCase(repo);
      const register = new RegisterUseCase(repo);
      await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      await expect(
        sut.executar({ email: EMAIL_VALIDO, senha: 'senha-errada' })
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });

    test('Deve lançar UnauthorizedError para email não cadastrado', async () => {
      const sut = new LoginUseCase(repo);

      await expect(
        sut.executar({ email: 'nao@existe.com', senha: SENHA_VALIDA })
      ).rejects.toBeInstanceOf(UnauthorizedError);
    });
  });

  // ─── DeletarUserUseCase ──────────────────────────────────────────────────────

  describe('Cenário: Deleção', () => {
    test('Deve deletar um usuário existente e retornar true', async () => {
      const register = new RegisterUseCase(repo);
      const sut = new DeletarUserUseCase(repo);
      const { user } = await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      const resultado = await sut.executar(user!.id);

      expect(resultado).toBe(true);
      const busca = await repo.findById(user!.id);
      expect(busca).toBeNull();
    });

    test('Deve lançar ResourceNotFoundError ao deletar ID inexistente', async () => {
      const sut = new DeletarUserUseCase(repo);

      await expect(sut.executar(UUID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    test('Deve lançar ValidationError para UUID com formato inválido', async () => {
      const sut = new DeletarUserUseCase(repo);

      await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── AcharPorEmail ───────────────────────────────────────────────────────────

  describe('Cenário: Buscar por Email', () => {
    test('Deve retornar o usuário quando o email existe', async () => {
      const register = new RegisterUseCase(repo);
      const sut = new AcharPorEmail(repo);
      await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      const resultado = await sut.executar(EMAIL_VALIDO);

      expect(resultado?.email).toBe(EMAIL_VALIDO);
    });

    test('Deve lançar ResourceNotFoundError para email não cadastrado', async () => {
      const sut = new AcharPorEmail(repo);

      await expect(sut.executar('nao@existe.com')).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });

  // ─── AcharPorId ──────────────────────────────────────────────────────────────

  describe('Cenário: Buscar por ID', () => {
    test('Deve retornar o usuário quando o ID existe', async () => {
      const register = new RegisterUseCase(repo);
      const sut = new AcharPorId(repo);
      const { user } = await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      const resultado = await sut.executar(user!.id);

      expect(resultado?.id).toBe(user!.id);
    });

    test('Deve lançar ResourceNotFoundError para ID inexistente', async () => {
      const sut = new AcharPorId(repo);

      await expect(sut.executar(UUID_VALIDO)).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    test('Deve lançar ValidationError para UUID com formato inválido', async () => {
      const sut = new AcharPorId(repo);

      await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── VerificarEmailExiste ────────────────────────────────────────────────────

  describe('Cenário: Verificar Email', () => {
    test('Deve retornar { existe: true } para email cadastrado', async () => {
      const register = new RegisterUseCase(repo);
      const sut = new VerificarEmailExiste(repo);
      await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      const resultado = await sut.executar(EMAIL_VALIDO);

      expect(resultado.existe).toBe(true);
    });

    test('Deve retornar { existe: false } para email não cadastrado', async () => {
      const sut = new VerificarEmailExiste(repo);

      const resultado = await sut.executar('nao@existe.com');

      expect(resultado.existe).toBe(false);
    });

    test('Deve lançar ValidationError para email com formato inválido', async () => {
      const sut = new VerificarEmailExiste(repo);

      await expect(sut.executar('email-invalido')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── ChangePassword ──────────────────────────────────────────────────────────

  describe('Cenário: Alterar Senha', () => {
    test('Deve alterar a senha com credenciais corretas', async () => {
      const register = new RegisterUseCase(repo);
      const sut = new ChangePassword(repo);
      const { user } = await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      await expect(
        sut.executar({ id: user!.id, senha_atual: SENHA_VALIDA, nova_senha: 'novaSenha456' })
      ).resolves.not.toThrow();
    });

    test('Deve lançar erro ao fornecer senha atual incorreta', async () => {
      const register = new RegisterUseCase(repo);
      const sut = new ChangePassword(repo);
      const { user } = await register.executar({ email: EMAIL_VALIDO, senha: SENHA_VALIDA, cpf: CPF_VALIDO });

      await expect(
        sut.executar({ id: user!.id, senha_atual: 'senha-errada', nova_senha: 'novaSenha456' })
      ).rejects.toThrow();
    });

    test('Deve lançar erro ao tentar alterar senha de usuário inexistente', async () => {
      const sut = new ChangePassword(repo);

      await expect(
        sut.executar({ id: UUID_VALIDO, senha_atual: SENHA_VALIDA, nova_senha: 'novaSenha456' })
      ).rejects.toThrow();
    });
  });
});
