import { CriarCarteiraDto } from '../../dtos/carteira';
import { Carteira, CarteiraStatus } from '../../entities/Carteira';
import { ICarteiraRepository } from '../../repositories/ICarteiraRepository';


export class CriarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(carteira: CriarCarteiraDto) {
    let duplicada;
    if (carteira.usuario_id){
     duplicada = await this.carteiraRepository.findByUserId(carteira.usuario_id);
      if (duplicada){
        throw new Error('Usuario ja possui uma carteira');
      }
    } else if (carteira.prestador_id) { 
     duplicada = await this.carteiraRepository.findByPrestadorId(carteira.prestador_id);
      if (duplicada){
        throw new Error('Prestador ja tem uma carteira');
      }
    }

    await this.carteiraRepository.create(carteira);
    
  }

}

export class DeletarCarteiraUseCase {
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    await this.carteiraRepository.delete(id);
  }

}

export class AtualizarMetodosDePagamentoUseCase { 
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, methods: string) {
    await this.carteiraRepository.updatePaymentMethods(id, methods);
  }

}

export class AtualizarStatus {
  constructor(private carteiraRepository: ICarteiraRepository) {}

async executar(id: string, status: CarteiraStatus) {
    await this.carteiraRepository.updateStatus(id, status);
  }

}

export class AtualizarSaldoUseCase { 
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string, saldo: string) {
    await this.carteiraRepository.updateBalance(id, saldo);
  }

}

export class AcharPorUserId { 
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    const carteira = await this.carteiraRepository.findByUserId(id);
    return carteira;
}}

export class AcharPorPrestadorId { 
  constructor(private carteiraRepository: ICarteiraRepository) {}

  async executar(id: string) {
    const carteira = await this.carteiraRepository.findByPrestadorId(id);
    return carteira;
  }

}

