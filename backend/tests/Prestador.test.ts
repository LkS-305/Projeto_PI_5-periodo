import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { InMemoryPrestadorRepository } from './repositories/InMemoryPrestadorRepository';
import { CriarPrestadorUseCase, DeletarPrestadorUseCase, AtualizarPrestadorUseCase, PesquisarPorId, PesquisarPorEmail } from '../src/core/use-cases/prestador/PrestadorUseCase';




describe('Suíte de Testes: Prestador', () => {
  let repo: InMemoryPrestadorRepository;

  // Reinicia o repositório antes de cada teste para um não interferir no outro
  beforeEach(() => {
    repo = new InMemoryPrestadorRepository();
  });

  describe('Cenário: Cadastro de Prestador', () => {
    test('Deve cadastrar um novo prestador com sucesso', async () => {
      const sut = new CriarPrestadorUseCase(repo);
      const user = await sut.executar({
        email: 'guigui@teste.com',
        senha: '123',
      });

      assert.strictEqual(user.email, 'guigui@teste.com');
      assert.ok(user.id);
    });

    test('Não deve permitir e-mails duplicados', async () => {
      const sut = new CriarPrestadorUseCase(repo);
      const dados = { email: 'guigui2@teste.com', senha: '1' };
      
      await sut.executar(dados);

      await assert.rejects(
        async () => { await sut.executar(dados) },
        /Este email ja existe/ // Verifica se a mensagem de erro contém esse texto
      );
    });
  });


  describe('Cenário: Perfil e Deleção', () => {
    test('Deve buscar um perfil pelo email', async () => {
      const sut = new PesquisarPorEmail(repo);
      const criado = await repo.create({ email: 'teste@gmail.com', senha: '1' });

      const user = await sut.executar(criado.email);
      assert.strictEqual(user?.senha, '1');
    });

    test('Deve deletar um prestador existente', async () => {
      const sut = new DeletarPrestadorUseCase(repo);
      const userr = await repo.create({email: 'sla@gmail', senha: '22'});
      const user = await repo.findByEmail(userr.email);

      const result = await sut.executar(user!.id!);
      assert.strictEqual(result, true);
      
      // Verifica se realmente sumiu do repositório
      const search = await repo.findById(user!.id!);
      assert.strictEqual(search, null);
    });

    test('Deve retornar false ao tentar deletar um ID inexistente', async () => {
        const sut = new DeletarPrestadorUseCase(repo);
        const result = await sut.executar('id-que-nao-existe');
        assert.strictEqual(result, false);
    });
  });
}
