import { Endereco } from '../entities/Endereco';
import { CriarEnderecoDto } from '../dtos/endereco';

export interface IEnderecoRepository {
  create(endereco: Endereco): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<Endereco | null>;
  update(id: string, endereco: CriarEnderecoDto): Promise<void>;
}
 
