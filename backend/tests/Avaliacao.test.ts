import { randomUUID } from 'crypto';
import { Avaliacao } from '../src/core/entities/Avaliacao';
import { InMemoryAvaliacaoRepository } from './repositories/InMemoryAvaliacaoRepository';

describe('Suite de testes: Avaliacao (In-Memory)', () => {
  let repo: InMemoryAvaliacaoRepository;

  beforeEach(() => {
    repo = new InMemoryAvaliacaoRepository();
  });

  it('Deve criar uma nova avaliação com sucesso', async () => {
    const avaliacao = new Avaliacao({
      servico_id: 'a1',
      usuario_id: 'c1',
      prestador_id: undefined,
      nota: 5,
      comentario: 'Show!',
      media: 'url',
      destinatario: 'servico'
    }, randomUUID());

    await repo.create(avaliacao);
    const buscada = await repo.listBy(avaliacao.id!, 'avaliacao');

    expect(buscada).not.toBeNull();
    expect(buscada![0].id).toBe(avaliacao.id);
  });

  it('Deve atualizar uma avaliação existente', async () => {
    const original = new Avaliacao({
      usuario_id: 'c1', servico_id: 'a1', prestador_id: undefined, nota: 3, comentario: 'Show!', media: undefined, destinatario: 'servico'
    }, randomUUID());
    await repo.create(original);

    const dadosAtualizados = new Avaliacao({ ...original, comentario: 'Atualizado!' }, original.id);
    await repo.update(dadosAtualizados.id!, dadosAtualizados);

    const resultado = await repo.listBy(original.id!, 'avaliacao');

    expect(resultado).not.toBeNull();
    expect(resultado![0].comentario).toBe('Atualizado!');
  });

  it('Deve deletar uma avaliação com sucesso', async () => {
    const avaliacao = new Avaliacao({
      servico_id: 'a3',
      usuario_id: 'c3',
      prestador_id: undefined,
      nota: 5,
      comentario: 'Show!',
      media: undefined,
      destinatario: 'servico'
    }, randomUUID());
    await repo.create(avaliacao);

    await repo.delete(avaliacao.id!);
    const buscada = await repo.listBy(avaliacao.id!, 'avaliacao');

    expect(buscada).toBeNull();
  });

  describe('Testes de Busca (listBy)', () => {
    it('1. Deve buscar avaliações por SERVIÇO', async () => {
      const idBusca = 'servico-123';
      await repo.create({ servico_id: idBusca, usuario_id: 'u1', prestador_id: undefined, nota: 5, comentario: undefined, media: undefined, destinatario: 'servico' });

      const resultado = await repo.listBy(idBusca, 'servico');

      expect(resultado).not.toBeNull();
      expect(resultado![0].servico_id).toBe(idBusca);
    });

    it('2. Deve buscar avaliações por PRESTADOR', async () => {
      const idBusca = 'prestador-456';
      await repo.create({ servico_id: undefined, prestador_id: idBusca, usuario_id: 'u1', nota: 4, comentario: undefined, media: undefined, destinatario: 'prestador' });

      const resultado = await repo.listBy(idBusca, 'prestador');

      expect(resultado).not.toBeNull();
      expect(resultado![0].prestador_id).toBe(idBusca);
    });

    it('3. Deve buscar avaliações por USUÁRIO', async () => {
      const idBusca = 'usuario-789';
      await repo.create({ usuario_id: idBusca, servico_id: 's1', prestador_id: undefined, nota: 3, comentario: undefined, media: undefined, destinatario: 'servico' });

      const resultado = await repo.listBy(idBusca, 'usuario');

      expect(resultado).not.toBeNull();
      expect(resultado![0].usuario_id).toBe(idBusca);
    });

    it('4. Deve buscar uma AVALIAÇÃO específica pelo ID dela', async () => {
      await repo.create({ usuario_id: 'u1', servico_id: 's1', prestador_id: undefined, nota: 2, comentario: undefined, media: undefined, destinatario: 'servico' });

      const todas = await repo.listBy('u1', 'usuario');
      const idEspecifico = todas![0].id!;

      const resultado = await repo.listBy(idEspecifico, 'avaliacao');

      expect(resultado).not.toBeNull();
      expect(resultado![0].id).toBe(idEspecifico);
    });

    it('Deve retornar NULL quando não encontrar nada', async () => {
      const resultado = await repo.listBy('id-inexistente', 'servico');
      expect(resultado).toBeNull();
    });
  });
});
