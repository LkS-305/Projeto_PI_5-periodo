import { CriarAvaliacaoDto, ListBy } from '../../dtos/avaliacao';
import { IAvaliacaoRepository } from '../../repositories/IAvaliacaoRepository';
import { ResourceNotFoundError, ValidationError } from '../../errors/AppError';
import { validarUUID, validarNota, sanitizarTexto } from '../../utils/validate';


export class CriarAvaliacaoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(avaliacao: CriarAvaliacaoDto) {
    validarNota(avaliacao.nota);
    if (avaliacao.comentario) avaliacao.comentario = sanitizarTexto(avaliacao.comentario);

    const avaliacaoCriada = await this.avaliacaoRepository.create(avaliacao);

    if (!avaliacaoCriada) {
      throw new ValidationError('Erro ao criar avaliação.');
    }

    return avaliacaoCriada;
  }
}

export class AtualizarAvaliacaoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(id: string, avaliacao: Partial<CriarAvaliacaoDto>) {
    validarUUID(id, 'ID da avaliação');
    if (avaliacao.nota !== undefined) validarNota(avaliacao.nota);

    const avaliacaoAtualizada = await this.avaliacaoRepository.update(id, avaliacao);

    if (!avaliacaoAtualizada) {
      throw new ResourceNotFoundError('Avaliação');
    }

    return avaliacaoAtualizada;
  }
}

export class DeletarAvaliacaoUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(id: string) {
    validarUUID(id, 'ID da avaliação');
    await this.avaliacaoRepository.delete(id);
  }
}


export class ListarPorId {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async executar(id: string, destinatario: ListBy) {
    validarUUID(id, 'ID');
    const avaliacoesListadas = await this.avaliacaoRepository.listBy(id, destinatario);

    if (!avaliacoesListadas) {
      throw new ResourceNotFoundError('Avaliações');
    }

    return avaliacoesListadas;
  }
}

