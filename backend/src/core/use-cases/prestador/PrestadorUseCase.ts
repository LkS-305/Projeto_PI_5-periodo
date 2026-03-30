import { IPrestadorRepository } from "../../repositories/IPrestadorRepository";
import { Prestador } from "../../entities/Prestador";
import { CriarPrestadorDto } from "../../dtos/prestador";

export class CriarPrestadorUseCase {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(prestador: CriarPrestadorDto) {
    const prestadorCriado = await this.prestadorRepository.create(prestador);

    if (!prestadorCriado) {
      throw new Error('Erro ao criar prestador');
    }

    return prestadorCriado;
  }
}

export class ListarPorCategoria {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(categoria: string) {
    const prestadores = await this.prestadorRepository.listByCategory(categoria)

    if (!prestadores) {
      throw new Error('Nenhum prestador pertence a essa categoria'); 
    }

    return prestadores;
  }
}

export class AcharPorId {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(id: string) {
    const prestador = await this.prestadorRepository.findById(id)

    if (!prestador) {
      throw new Error('Nenhum prestador pertence a essa categoria'); 
    }

    return prestador;
  }
}

export class AcharPorUserId {
  constructor(private prestadorRepository: IPrestadorRepository) {}

  async executar(userId: string) {
    const prestador = await this.prestadorRepository.findById(userId)

    if (!prestador) {
      throw new Error('Nenhum prestador pertence a essa categoria'); 
    }

    return prestador;
  }
}
