import { Request, Response } from 'express';
import { Endereco } from '../../entities/Endereco';
import { IEnderecoRepository } from '../../repositories/IEnderecoRepository';
import { CriarEnderecoDto } from '../../dtos/endereco';

export class CriarEnderecoUseCase {
    constructor(private enderecoRepository: IEnderecoRepository){}

    async executar(endereco: CriarEnderecoDto): Promise<void>{
     const endereco2 = await this.enderecoRepository.add(endereco);

     if (!endereco) {
      throw new Error('Erro ao criar endereco');

    }
 

  }
}
