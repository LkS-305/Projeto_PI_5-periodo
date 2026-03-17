import { CriarPrestadorDto } from '../dtos/prestador';
import { Prestador } from '../entities/Prestador';

export interface IPrestadorRepository {
  create(prestador: CriarPrestadorDto): Promise<Prestador>;
  findById(id: string): Promise<Prestador | null>;
  findByUserId(user_id: string): Promise<Prestador | null>;
  listByCategory(categoria: string): Promise<Prestador[] | null>;
}  
