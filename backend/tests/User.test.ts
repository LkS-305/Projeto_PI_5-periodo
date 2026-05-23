import { InMemoryUsuarioRepository } from './repositories/InMemoryUsuarioRepository';
import { DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorUserId } from '../src/core/use-cases/usuario/UsuarioUseCase';

const UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('Suíte de Testes: Usuário', () => {
  let repo: InMemoryUsuarioRepository;

  beforeEach(() => {
    repo = new InMemoryUsuarioRepository();
  });

  describe('Cenário: Deleção', () => {
    test('Deve deletar um usuário existente', async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      await repo.create({ user_id: UUID, nome: 'Teste' });
      const user = await repo.findByUserId(UUID);

      const result = await sut.executar(user!.user_id);
      expect(result).toBe(true);

      const search = await repo.findByUserId(user!.user_id);
      expect(search).toBeNull();
    });

    test('Deve retornar false ao tentar deletar um ID inexistente', async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      await expect(sut.executar(UUID)).rejects.toBeDefined();
    });
  });

  describe('Cenário: Pesquisar por user_id', () => {
    test('Deve buscar um perfil pelo user_id', async () => {
      const sut = new PesquisarPorUserId(repo);
      await repo.create({ user_id: UUID, nome: 'Pesquisa' });

      const usuario = await sut.executar(UUID);
      expect(usuario?.user_id).toBe(UUID);
      expect(usuario?.nome).toBe('Pesquisa');
    });
  });

  describe('Cenário: UPDATE', () => {
    test('Deve atualizar um usuário', async () => {
      const sut = new AtualizarUsuarioUseCase(repo);
      await repo.create({ user_id: UUID, nome: 'Original' });

      await sut.executar({ user_id: UUID, nome: 'Novo Nome' });

      const atualizado = await repo.findByUserId(UUID);
      expect(atualizado?.nome).toBe('Novo Nome');
    });
  });
});
