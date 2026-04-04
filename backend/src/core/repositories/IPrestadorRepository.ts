import { CriarPrestadorDto } from "../dtos/prestador";
import { Prestador } from "../entities/Prestador";

export interface IPrestadorRepository {
  create(prestador: CriarPrestadorDto): Promise<Prestador>;
  delete(id: string): Promise<void>;
  update(id: string, prestador: Partial<Prestador>): Promise<Prestador | null>;
  findById(id: string): Promise<Prestador | null>;
  findByUserId(user_id: string): Promise<Prestador | null>;
  listByCategory(categoria: string): Promise<Prestador[] | null>;
}
