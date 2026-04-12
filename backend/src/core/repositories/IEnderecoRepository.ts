import { Endereco } from '../entities/Endereco';
import { CriarEnderecoDto } from '../dtos/endereco';

export interface IEnderecoRepository {
  create(endereco: Endereco): Promise<Endereco>;
  update(endereco: Endereco): Promise<Endereco | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Endereco | null>;
  findByUserId(id: string): Promise<Endereco | null>;
  findByPrestadorId(prestador_id: string): Promise<Endereco | null>;
  findByCity(cidade: string): Promise<Endereco[] | null>;
  setIsPrincipal(id: string): Promise<void>;
  unsetIsPrincipal(id: string): Promise<void>;
}
  
