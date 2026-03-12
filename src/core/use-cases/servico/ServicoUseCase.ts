import { Servico } from '../../entities/Servico';
import { ServicoStatus } from '../../dtos/servico';
import { IServicoRepository } from '../../repositories/IServicoRepository';

import { CriarServicoDto } from '../../dtos/servico';


export class CriarServicoUseCase {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(servico: CriarServicoDto) {
    const servico2 = await this.servicoRepository.create(servico);

    if (!servico2){
      throw new Error('Erro ao criar servico');
    }

    return servico2;
  }
}


export class PesquisarServicoId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    const servico2 = await this.servicoRepository.findById(id);

    if (!servico2){
      throw new Error('Erro ao criar servico');
    }

    return servico2;
  }
}

export class PesquisarServicoUserId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    const servico2 = await this.servicoRepository.findByUserId(id);

    if (!servico2){
      throw new Error('Erro ao criar servico');
    }

    return servico2;
  }
}


export class PesquisarServicoPrestadorId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    const servico2 = await this.servicoRepository.findByPrestadorId(id);

    if (!servico2){
      throw new Error('Erro ao criar servico');
    }

    return servico2;
  }
}


export class UpdateStatusUseCase {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string, status: ServicoStatus) {
    await this.servicoRepository.updateStatus(id, status);
    return;
  }
} 
