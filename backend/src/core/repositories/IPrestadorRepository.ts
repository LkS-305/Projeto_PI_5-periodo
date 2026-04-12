import { AtualizarPrestadorDto, CriarPrestadorDto } from "../dtos/prestador";
import { Prestador } from "../entities/Prestador";

export interface IPrestadorRepository {
  create(prestador: CriarPrestadorDto): Promise<Prestador>;
  delete(user_id: string): Promise<void>;
  update(novoPrestador: AtualizarPrestadorDto): Promise<void>;
  findByUserId(user_id: string): Promise<Prestador | null>;
}
