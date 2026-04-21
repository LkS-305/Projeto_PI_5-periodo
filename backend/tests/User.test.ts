import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { InMemoryUsuarioRepository } from './repositories/InMemoryUsuarioRepository';
import {  DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorId, PesquisarPorEmail } from '../src/core/use-cases/usuario/UsuarioUseCase';




describe('Suíte de Testes: Usuário', () => {
  let repo: InMemoryUsuarioRepository;

  // Reinicia o repositório antes de cada teste para um não interferir no outro 
  beforeEach(() => {
    repo = new InMemoryUsuarioRepository();
  });

  describe('Cenário: Deleção', () => {
    test('Deve deletar um usuário existente', async () => {
      const sut = new DeletarUsuarioUseCase(repo);
      const userr = await repo.create({email: 'sla@gmail', senha: '22'});
      const user = await repo.findByEmail(userr.email);

      const result = await sut.executar(user!.id!);
      assert.strictEqual(result, true);
      
      // Verifica se realmente sumiu do repositório
      const search = await repo.findById(user!.id!);
      assert.strictEqual(search, null);
    });

    test('Deve retornar false ao tentar deletar um ID inexistente', async () => {
        const sut = new DeletarUsuarioUseCase(repo);
        const result = await sut.executar('id-que-nao-existe');
        assert.strictEqual(result, false);
    });
  });

  describe('Cenario: deve achar um usuario pelo email', () => {
     test('Deve buscar um perfil pelo email', async () => {
      const sut = new PesquisarPorEmail(repo);
      const criado = await repo.create({ email: 'teste@gmail.com', senha: '1' });

      const user = await sut.executar(criado.email);
      assert.strictEqual(user?.senha, '1');
    });
  });

  describe('Cenario: UPDATE', () => {
    test('Deve atualiar um usuario', async () => {
      const sut = new AtualizarUsuarioUseCase(repo);
      const criado = await repo.create({email: 'teste2@gmail.com', senha: '2' });

      const usuario = await repo.findByEmail('teste2@gmail.com');
      await repo.update(usuario!.id!, {email: 'novoEmail@gmail.com' });

      const atualizado = await repo.findByEmail('novoEmail@gmail.com');
      assert.notStrictEqual(atualizado, null);
    });
  });
});
