import { IPrestadorCategoriaRepository } from '../../repositories/IPrestadorCategoriaRepository';
import { IPrestadorRepository } from '../../repositories/IPrestadorRepository';
import { ICategoriaRepository } from '../../repositories/ICategoriaRepository';
import { ResourceNotFoundError, AppError } from '../../errors/AppError';

export class AdicionarCategoriaUseCase {
  constructor(
    private prestadorCategoriaRepository: IPrestadorCategoriaRepository,
    private prestadorRepository: IPrestadorRepository,
    private categoriaRepository: ICategoriaRepository,
  ) {}

  async executar(prestador_id: string, categoria_id: string): Promise<void> {
    const prestador = await this.prestadorRepository.findByUserId(prestador_id);
    if (!prestador) throw new ResourceNotFoundError('Prestador');

    const categoria = await this.categoriaRepository.findById(categoria_id);
    if (!categoria) throw new ResourceNotFoundError('Categoria');

    const categorias = await this.prestadorCategoriaRepository.listarPorPrestador(prestador_id);
    if (categorias.length >= 5) {
      throw new AppError('Um prestador pode ter no máximo 5 categorias', 400);
    }

    await this.prestadorCategoriaRepository.adicionar(prestador_id, categoria_id);
  }
}

export class RemoverCategoriaUseCase {
  constructor(
    private prestadorCategoriaRepository: IPrestadorCategoriaRepository,
    private prestadorRepository: IPrestadorRepository,
  ) {}

  async executar(prestador_id: string, categoria_id: string): Promise<void> {
    const prestador = await this.prestadorRepository.findByUserId(prestador_id);
    if (!prestador) throw new ResourceNotFoundError('Prestador');

    await this.prestadorCategoriaRepository.remover(prestador_id, categoria_id);
  }
}

export class ListarCategoriasDoPrestadorUseCase {
  constructor(private prestadorCategoriaRepository: IPrestadorCategoriaRepository) {}

  async executar(prestador_id: string) {
    return await this.prestadorCategoriaRepository.listarPorPrestador(prestador_id);
  }
}

export class ListarPrestadoresPorCategoriaUseCase {
  constructor(private prestadorCategoriaRepository: IPrestadorCategoriaRepository) {}

  async executar(categoria_id: string) {
    return await this.prestadorCategoriaRepository.listarPrestadoresPorCategoria(categoria_id);
  }
}
