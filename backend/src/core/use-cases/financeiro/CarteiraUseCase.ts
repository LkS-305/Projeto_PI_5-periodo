import { CriarCarteiraDto } from '../../dtos/carteira';
import { Carteira, CarteiraStatus } from '../../entities/Carteira';
import { ICarteiraRepository } from '../../repositories/ICarteiraRepository';
import { ResourceAlreadyExistsError } from '../../errors/AppError';
import { validarId, validarUUID } from '../../utils/validate';


export class CriarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(dados: Carteira) {
    if (dados.user_id) {
      validarId(dados.user_id, 'ID do usuário');
      const duplicada = await this.carteiraRepository.findByUserId(dados.user_id);
      if (duplicada) throw new ResourceAlreadyExistsError('Usuário já possui uma carteira.');
    }

    const carteira = new Carteira(dados);
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
    validarId(id, 'ID do usuário');
    return await this.carteiraRepository.findByUserId(id);
  }
}

export class AcharPorPrestadorId {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    validarId(id, 'ID do prestador');
    return await this.carteiraRepository.findByPrestadorId(id);
  }
}

