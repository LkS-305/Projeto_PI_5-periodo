import { CriarCarteiraDto } from "../../dtos/carteira";
import { Carteira, CarteiraStatus } from "../../entities/Carteira";
import { ICarteiraRepository } from "../../repositories/ICarteiraRepository";
import {
  ResourceAlreadyExistsError,
  ValidationError,
} from "../../errors/AppError";
import { validarUUID } from "../../utils/validate";

export class CriarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(dados: Carteira) {
    if (dados.user_id) {
      validarUUID(dados.user_id, "ID do usuário");
      const duplicada = await this.carteiraRepository.findByUserId(
        dados.user_id,
      );
      if (duplicada)
        throw new ResourceAlreadyExistsError("Usuário já possui uma carteira.");
    }

    const carteira = new Carteira(dados);
    await this.carteiraRepository.create(carteira);
  }
}

export class DeletarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    validarUUID(id, "ID da carteira");
    await this.carteiraRepository.delete(id);
  }
}

export class AtualizarMetodosDePagamentoUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, methods: string) {
    validarUUID(id, "ID da carteira");
    await this.carteiraRepository.updatePaymentMethods(id, methods);
  }
}

/** Grava JSON em `metodos_de_pagamento` (cartão do cliente, dados bancários mock do prestador, etc.). */
export class AtualizarMetodosPorContaUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(owner_id: string, dados: string) {
    if (!owner_id || typeof owner_id !== "string" || !owner_id.trim()) {
      throw new ValidationError("ID da conta inválido.");
    }
    if (typeof dados !== "string" || !dados.trim()) {
      throw new ValidationError("Dados de pagamento inválidos.");
    }
    const n = await this.carteiraRepository.updatePaymentMethodsByOwnerKey(
      owner_id,
      dados,
    );
    if (n === 0) {
      throw new ValidationError(
        "Não foi encontrada carteira para este utilizador. Contacte o suporte ou conclua um pagamento na plataforma.",
      );
    }
  }
}

export class AtualizarStatus {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, status: CarteiraStatus) {
    validarUUID(id, "ID da carteira");
    await this.carteiraRepository.updateStatus(id, status);
  }
}

export class AtualizarSaldoUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, saldo: string) {
    validarUUID(id, "ID da carteira");
    await this.carteiraRepository.updateBalance(id, saldo);
  }
}

export class AcharPorUserId {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    validarUUID(id, "ID do usuário");
    return await this.carteiraRepository.findByUserId(id);
  }
}

export class AcharPorPrestadorId {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    validarUUID(id, "ID do prestador");
    return await this.carteiraRepository.findByPrestadorId(id);
  }
}
