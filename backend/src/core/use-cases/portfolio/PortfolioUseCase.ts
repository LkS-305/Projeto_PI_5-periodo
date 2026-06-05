import { IPortfolioRepository, PortfolioItem } from '../../repositories/IPortfolioRepository';
import { IPrestadorRepository } from '../../repositories/IPrestadorRepository';
import { AppError, ResourceNotFoundError } from '../../errors/AppError';
import { randomUUID } from 'crypto';

const MAX_ITENS = 10;

export class AdicionarItemPortfolioUseCase {
  constructor(
    private portfolioRepository: IPortfolioRepository,
    private prestadorRepository: IPrestadorRepository,
  ) {}

  async executar(dados: {
    prestador_id: string;
    url: string;
    tipo: 'imagem' | 'video';
    descricao?: string;
  }): Promise<PortfolioItem> {
    const prestador = await this.prestadorRepository.findByUserId(dados.prestador_id);
    if (!prestador) throw new ResourceNotFoundError('Prestador');

    const total = await this.portfolioRepository.countByPrestadorId(dados.prestador_id);
    if (total >= MAX_ITENS) {
      throw new AppError(`O portfólio pode ter no máximo ${MAX_ITENS} itens`, 400);
    }

    return await this.portfolioRepository.create({
      id: randomUUID(),
      prestador_id: dados.prestador_id,
      url: dados.url,
      tipo: dados.tipo,
      descricao: dados.descricao,
      ordem: total,
    });
  }
}

export class DeletarItemPortfolioUseCase {
  constructor(private portfolioRepository: IPortfolioRepository) {}

  async executar(id: string, prestador_id: string): Promise<string> {
    const item = await this.portfolioRepository.findById(id);
    if (!item) throw new ResourceNotFoundError('Item do portfólio');
    if (item.prestador_id !== prestador_id) {
      throw new AppError('Você não tem permissão para remover este item', 403);
    }

    const url = await this.portfolioRepository.delete(id);
    return url!;
  }
}

export class ListarPortfolioPorPrestadorUseCase {
  constructor(private portfolioRepository: IPortfolioRepository) {}

  async executar(prestador_id: string): Promise<PortfolioItem[]> {
    return await this.portfolioRepository.findByPrestadorId(prestador_id);
  }
}

export class ReordenarPortfolioUseCase {
  constructor(
    private portfolioRepository: IPortfolioRepository,
    private prestadorRepository: IPrestadorRepository,
  ) {}

  async executar(prestador_id: string, items: { id: string; ordem: number }[]): Promise<void> {
    const prestador = await this.prestadorRepository.findByUserId(prestador_id);
    if (!prestador) throw new ResourceNotFoundError('Prestador');

    await this.portfolioRepository.reordenar(items);
  }
}
