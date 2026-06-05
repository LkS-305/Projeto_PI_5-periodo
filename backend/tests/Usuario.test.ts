import { InMemoryUsuarioRepository } from './repositories/InMemoryUsuarioRepository';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';
import {
  CriarUsuarioUseCase,
  DeletarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  PesquisarPorUserId,
} from '../src/core/use-cases/usuario/UsuarioUseCase';
import { RegisterUseCase } from '../src/core/use-cases/user/UserUseCase';
import {
  ResourceNotFoundError,
  ValidationError,
} from '../src/core/errors/AppError';

const UUID_VALIDO = '123e4567-e89b-12d3-a456-426614174000';
const UUID_INEXISTENTE = '999e4567-e89b-12d3-a456-426614174999';

describe('Suíte de Testes: Usuário', () => {
  let repo: InMemoryUsuarioRepository;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    repo = new InMemoryUsuarioRepository();
    userRepo = new InMemoryUserRepository();
  });

  // ─── CriarUsuarioUseCase ─────────────────────────────────────────────────────

  describe('Cenário: Cadastro', () => {
    test('Deve cadastrar um novo usuário vinculado a um user existente', async () => {
      const registerUC = new RegisterUseCase(userRepo);
      const sut = new CriarUsuarioUseCase(repo, userRepo);
      const { user } = await registerUC.executar({
        email: 'teste@gmail.com',
        senha: 'senha123',
        cpf: '12345678900',
      });

      const usuario = await sut.executar(user!.id, 'Nome Teste');

      expect(usuario.user_id).toBe(user!.id);
      expect(usuario.nome).toBe('Nome Teste');
    });

    test('Deve lançar ResourceNotFoundError ao criar usuário para user inexistente', async () => {
      const sut = new CriarUsuarioUseCase(repo, userRepo);

      await expect(sut.executar(UUID_VALIDO, 'Nome')).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });

  // ─── DeletarUsuarioUseCase ───────────────────────────────────────────────────

  describe('Cenário: Deleção', () => {
    test('Deve deletar um usuário existente e retornar true', async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      await repo.create({ user_id: UUID_VALIDO, nome: 'Para Deletar' });

      const resultado = await sut.executar(UUID_VALIDO);

      expect(resultado).toBe(true);
      const busca = await repo.findByUserId(UUID_VALIDO);
      expect(busca).toBeNull();
    });

    test('Deve lançar ResourceNotFoundError ao deletar ID inexistente', async () => {
      const sut = new DeletarUsuarioUseCase(repo);

      await expect(sut.executar(UUID_INEXISTENTE)).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    test('Deve lançar ValidationError para UUID com formato inválido', async () => {
      const sut = new DeletarUsuarioUseCase(repo);

      await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  // ─── AtualizarUsuarioUseCase ─────────────────────────────────────────────────

  describe('Cenário: Atualização', () => {
    test('Deve atualizar o nome de um usuário existente', async () => {
      const sut = new AtualizarUsuarioUseCase(repo);
      await repo.create({ user_id: UUID_VALIDO, nome: 'Nome Original' });

      const resultado = await sut.executar({ user_id: UUID_VALIDO, nome: 'Nome Atualizado' });

      expect(resultado.nome).toBe('Nome Atualizado');
      const buscado = await repo.findByUserId(UUID_VALIDO);
      expect(buscado?.nome).toBe('Nome Atualizado');
    });

    test('Deve atualizar a foto_url de um usuário existente', async () => {
      const sut = new AtualizarUsuarioUseCase(repo);
      await repo.create({ user_id: UUID_VALIDO, nome: 'Nome' });

      const resultado = await sut.executar({ user_id: UUID_VALIDO, foto_url: 'https://foto.com/nova.jpg' });

      expect(resultado.foto_url).toBe('https://foto.com/nova.jpg');
    });

    test('Deve lançar ResourceNotFoundError ao atualizar usuário inexistente', async () => {
      const sut = new AtualizarUsuarioUseCase(repo);

      await expect(
        sut.executar({ user_id: UUID_INEXISTENTE, nome: 'Nome' })
      ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
  });

  // ─── PesquisarPorUserId ──────────────────────────────────────────────────────

  describe('Cenário: Pesquisar por user_id', () => {
    test('Deve retornar o usuário correto ao buscar por user_id', async () => {
      const sut = new PesquisarPorUserId(repo);
      await repo.create({ user_id: UUID_VALIDO, nome: 'Usuário Buscado' });

      const resultado = await sut.executar(UUID_VALIDO);

      expect(resultado?.user_id).toBe(UUID_VALIDO);
      expect(resultado?.nome).toBe('Usuário Buscado');
    });

    test('Deve lançar ResourceNotFoundError para user_id inexistente', async () => {
      const sut = new PesquisarPorUserId(repo);

      await expect(sut.executar(UUID_INEXISTENTE)).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    test('Deve lançar ValidationError para UUID com formato inválido', async () => {
      const sut = new PesquisarPorUserId(repo);

      await expect(sut.executar('id-invalido')).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
