import { Endereco } from '../entities/Endereco';
import { CriarEnderecoDto } from '../dtos/endereco';

export interface IEnderecoRepository {
  create(endereco: Endereco): Promise<void>;
  update(id: string, endereco: Partial<Endereco>): Promise<Endereco | null>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<Endereco | null>;
  findByPrestadorId(prestador_id: string): Promise<Endereco | null>;
  findByCity(cidade: string): Promise<Endereco[] | null>;
  setIsPrincipal(id: string): Promise<void>;
  unsetIsPrincipal(id: string): Promise<void>;
}
  
