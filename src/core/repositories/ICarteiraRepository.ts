import { CriarCarteiraDto } from '../dtos/carteira';
import { Carteira, CarteiraStatus } from '../entities/Carteira';

export interface ICarteiraRepository {
  create(carteira: CriarCarteiraDto): Promise<void>;
  delete(id: string): Promise<void>;
  updateBalance(id: string, balance: string): Promise<void> ;
  updatePaymentMethods(id: string, methods: string): Promise<void>;
  updateStatus(id: string, status: CarteiraStatus): Promise<void>;
  findByUserId(id: string): Promise<Carteira | null>;
  findByPrestadorId(id: string): Promise<Carteira | null>;

} 
