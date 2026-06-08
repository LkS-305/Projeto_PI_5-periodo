import { CriarCarteiraDto } from '../dtos/carteira';
import { Carteira, CarteiraStatus } from '../entities/Carteira';

export interface ICarteiraRepository {
  create(carteira: Carteira): Promise<void>;
  delete(id: string): Promise<void>;
  updateBalance(id: string, balance: string): Promise<void>;
  updateBlockedBalance(id: string, saldo_bloqueado: string): Promise<void>;
  updatePaymentMethods(id: string, methods: string): Promise<void>;
  /** Atualiza `metodos_de_pagamento` pela linha em que `user_id` ou `prestador_id` coincide com `ownerKey`. */
  updatePaymentMethodsByOwnerKey(ownerKey: string, methods: string): Promise<number>;
  updateStatus(id: string, status: CarteiraStatus): Promise<void>;
  findByUserId(id: string): Promise<Carteira | null>;
  findByPrestadorId(id: string): Promise<Carteira | null>;

} 
