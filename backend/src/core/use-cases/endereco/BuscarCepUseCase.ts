import { RetornoApi } from '../../dtos/endereco';
import { logUseCaseCatch } from '../../utils/httpLogger';

export class BuscarCepUseCase {
  constructor() {}

  async executar(cep: string): Promise<RetornoApi | string | null>{
     const sanitized = cep.replace(/\D/g, "");

      if (sanitized.length !== 8) throw new Error("CEP inválido");

    try {
      const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
      const data: RetornoApi = await res.json();
      
      if (data.erro) throw new Error("CEP não encontrado");
      return data;
    } catch (error: unknown) {
      logUseCaseCatch('BuscarCepUseCase', 'executar', error, { cep: sanitized });
      return error instanceof Error ? error.message : null;
    }
  }
}
 
