import { Request, Response } from 'express';
import { Endereco } from '../../entities/Endereco';
import { RetornoApi } from '../../dtos/endereco';

export class BuscarCepUseCase {
  constructor() {}

  async executar(cep: string): Promise<RetornoApi | string | null>{
     const sanitized = cep.replace(/\D/g, "");

      if (sanitized.length !== 8) throw new Error("CEP inválido");

    try {
      const res = await fetch('https://viacep.com.br/ws/${sanitized}/json/');
      const data: RetornoApi = await res.json();
      
      if (data.erro) throw new Error("CEP não encontrado");
      return data;
    } catch (error: any) {
       return error.message? error.message : null;
    }
  }
}
 
