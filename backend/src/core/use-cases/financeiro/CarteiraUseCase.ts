import { CriarCarteiraDto } from '../../dtos/carteira';
import { Carteira, CarteiraStatus } from '../../entities/Carteira';
import { ICarteiraRepository } from '../../repositories/ICarteiraRepository';
import { ResourceAlreadyExistsError } from '../../errors/AppError';
import { validarUUID } from '../../utils/validate';


export class CriarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(carteira: CriarCarteiraDto) {
    if (carteira.usuario_id) {
      validarUUID(carteira.usuario_id, 'ID do usuário');
      const duplicada = await this.carteiraRepository.findByUserId(carteira.usuario_id);
      if (duplicada) throw new ResourceAlreadyExistsError('Usuário já possui uma carteira.');
    } else if (carteira.prestador_id) {
      validarUUID(carteira.prestador_id, 'ID do prestador');
      const duplicada = await this.carteiraRepository.findByPrestadorId(carteira.prestador_id);
      if (duplicada) throw new ResourceAlreadyExistsError('Prestador já possui uma carteira.');
    }
    await this.carteiraRepository.create(carteira);
  }

}

export class DeletarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    validarUUID(id, 'ID da carteira');
    await this.carteiraRepository.delete(id);
  }
}

export class AtualizarMetodosDePagamentoUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, methods: string) {
    validarUUID(id, 'ID da carteira');
    await this.carteiraRepository.updatePaymentMethods(id, methods);
  }
}

export class AtualizarStatus {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, status: CarteiraStatus) {
    validarUUID(id, 'ID da carteira');
    await this.carteiraRepository.updateStatus(id, status);
  }
}

export class AtualizarSaldoUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, saldo: string) {
    validarUUID(id, 'ID da carteira');
    await this.carteiraRepository.updateBalance(id, saldo);
  }
}

export class AcharPorUserId {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    if (!id) throw new Error('ID do usuário é obrigatório.');
    return await this.carteiraRepository.findByUserId(id);
  }
}

export class AcharPorPrestadorId {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    if (!id) throw new Error('ID do prestador é obrigatório.');
    return await this.carteiraRepository.findByPrestadorId(id);
  }
}

