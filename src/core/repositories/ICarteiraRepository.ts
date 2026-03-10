import { Carteira } from '../entities/Carteira';

export interface ICarteiraRepository {
  create(carteira: Carteira): Promise<void>;
  findByUserId(id: string): Promise<Carteira | null>;
  findByPrestadorId(id: string): Promise<Carteira | null>;
  updateBalance(id: string, balance: string): Promise<void>
}
