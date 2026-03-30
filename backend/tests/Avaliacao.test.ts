import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { Avaliacao } from '../src/core/entities/Avaliacao';
import { InMemoryAvaliacaoRepository } from './repositories/InMemoryAvaliacaoRepository'; // Ajuste o path

describe('Suite de testes: Avaliacao (In-Memory)', () => {
  let repo: InMemoryAvaliacaoRepository;

  beforeEach(() => {
    // Reinicia o repositório antes de cada teste para garantir isolamento total
    repo = new InMemoryAvaliacaoRepository();
  });

  test('Deve criar uma nova avaliação com sucesso', async () => {
    const avaliacao = new Avaliacao({
      servico_id: 'a1',
      usuario_id: 'c1',
      prestador_id: undefined,
      nota: '5',
      comentario: 'Show!',
      media: 'url',
      destinatario: 'servico'
    });

    await repo.create(avaliacao);
    const buscada = await repo.listBy(avaliacao!.id!, 'avaliacao');

    assert.ok(buscada);
    assert.strictEqual(buscada[0].id, avaliacao.id);
  });

  test('Deve atualizar uma avaliação existente', async () => {
    // 1. Criar e Salvar
    const original = new Avaliacao({
        usuario_id: 'c1', servico_id: 'a1', nota: '3', comentario: 'Show!', destinatario: 'servico'
    });
    await repo.create(original);

    // 2. Criar objeto de atualização com o MESMO ID
    const dadosAtualizados = new Avaliacao({
        ...original,
        comentario: 'Atualizado!'
    }, original.id);

    // 3. Executar o Update
    await repo.update(dadosAtualizados.id!, dadosAtualizados);

    // 4. BUSCAR NOVAMENTE do repositório (O segredo está aqui)
    const resultado = await repo.listBy(original.id!, 'avaliacao');

    assert.ok(resultado);
    assert.strictEqual(resultado[0].comentario, 'Atualizado!'); // Agora deve passar
});

  test('Deve deletar uma avaliação com sucesso', async () => {
    const avaliacao = new Avaliacao({
      servico_id: 'a3',
      usuario_id: 'c3',
      prestador_id: undefined,
      nota: '5',
      comentario: 'Show!',
      media: 'url',
      destinatario: 'servico'
    });
    await repo.create(avaliacao);

    await repo.delete(avaliacao.id!);
    const buscada = await repo.listBy(avaliacao.id!, 'avaliacao');

    assert.strictEqual(buscada, null);
  });

  describe('Testes de Busca (listBy)', () => {

    test('1. Deve buscar avaliações por SERVIÇO', async () => {
        const idBusca = 'servico-123';
        await repo.create({ servico_id: idBusca, usuario_id: 'u1', nota: '5', destinatario: 'servico' });

        const resultado = await repo.listBy(idBusca, 'servico');

        assert.ok(resultado, 'Não retornou nada para serviço');
        assert.strictEqual(resultado[0].servico_id, idBusca);
    });

    test('2. Deve buscar avaliações por PRESTADOR', async () => {
        const idBusca = 'prestador-456';
        await repo.create({ prestador_id: idBusca, usuario_id: 'u1', nota: '4', destinatario: 'prestador' });

        const resultado = await repo.listBy(idBusca, 'prestador');

        assert.ok(resultado, 'Não retornou nada para prestador');
        assert.strictEqual(resultado[0].prestador_id, idBusca);
    });

    test('3. Deve buscar avaliações por USUÁRIO (quem avaliou)', async () => {
        const idBusca = 'usuario-789';
        await repo.create({ usuario_id: idBusca, servico_id: 's1', nota: '3', destinatario: 'servico' });

        const resultado = await repo.listBy(idBusca, 'usuario');

        assert.ok(resultado, 'Não retornou nada para usuário');
        assert.strictEqual(resultado[0].usuario_id, idBusca);
    });

    test('4. Deve buscar uma AVALIAÇÃO específica pelo ID dela', async () => {
        // Criamos primeiro para o repo gerar um ID
        await repo.create({ usuario_id: 'u1', servico_id: 's1', nota: '2', destinatario: 'servico' });
        
        // Pegamos todos para saber qual ID foi gerado no seu InMemory
        const todas = await repo.listBy('u1', 'usuario');
        const idEspecifico = todas![0].id!;

        const resultado = await repo.listBy(idEspecifico, 'avaliacao');

        assert.ok(resultado, 'Não retornou nada para o ID da avaliação');
        assert.strictEqual(resultado[0].id, idEspecifico);
    });

    test('Deve retornar NULL quando não encontrar nada', async () => {
        const resultado = await repo.listBy('id-inexistente', 'servico');
        assert.strictEqual(resultado, null);
    });
});
});
