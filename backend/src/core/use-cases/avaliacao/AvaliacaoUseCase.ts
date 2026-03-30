import { CriarAvaliacaoDto, ListBy } from '../../dtos/avaliacao';
import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository';


export class CriarAvaliacaoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(avaliacao: CriarAvaliacaoDto) {
    const avaliacaoCriada = await this.avaliacaoRepository.create(avaliacao);

    if (!avaliacaoCriada) {
      throw new Error('Erro ao criar avaliacao');
    }

    return avaliacaoCriada;
  }
}

export class AtualizarAvaliacaoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(id: string, avaliacao: Partial<CriarAvaliacaoDto>) {
    const avaliacaoAtualizada = await this.avaliacaoRepository.update(id, avaliacao);

    if (!avaliacaoAtualizada) {
      throw new Error('Erro ao atualizar avaliacao');
    }

    return avaliacaoAtualizada;
  }
}

export class DeletarAvaliacaoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(id: string) {
    await this.avaliacaoRepository.delete(id)
  }
}


export class ListarPorId {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(id: string, destinatario: ListBy) {
    const avaliacoesListadas = await this.avaliacaoRepository.listBy(id, destinatario);

    if (!avaliacoesListadas) {
      throw new Error('erro ao listar avaliacoes');
    }

    return avaliacoesListadas
  }
}

