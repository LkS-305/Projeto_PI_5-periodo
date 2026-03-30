import { IAgendamentosRepository } from '../../repositories/IAgendamentosRepository';
import { Agendamento } from '../../entities/Agendamento';



export class CriarAgendamentoUseCase {
  constructor(private agendamentosRepository: IAgendamentosRepository) {}

  async executar(dados: Agendamento) {
    const agendamento = new Agendamento(dados);
    
    const agendamentoCriado = await this.agendamentosRepository.create(agendamento);

    if(!agendamentoCriado){
      throw new Error('Falha ao criar agendamento');
    }

    return agendamentoCriado;
  }
}

export class DeletarAgendamentoUseCase {
  constructor(private agendamentosRepository: IAgendamentosRepository) {}

  async executar(id: string) {
    await this.agendamentosRepository.delete(id);
  }
}


export class AtualizarAgendamentoUseCase {
  constructor(private agendamentosRepository: IAgendamentosRepository) {}

  async executar(id: string, agendamento: Partial<Agendamento>) {
    const agendamentoExistente = await this.agendamentosRepository.findById(id);

    if(!agendamentoExistente){
      throw new Error('agendamento nao existente');
    }

    Object.assign(agendamentoExistente, agendamento);
    await this.agendamentosRepository.update(id, agendamento);

    return agendamentoExistente;
  }
}

export class AcharPorId {
  constructor(private agendamentosRepository: IAgendamentosRepository){}

  async executar(id: string) {
    const agendamento = await this.agendamentosRepository.findById(id);

    if (!agendamento) {
      throw new Error('erro ao achar agendamento por id');
    }

    return agendamento;
  }
}


export class AcharPorUserId {
  constructor(private agendamentosRepository: IAgendamentosRepository) {}

  async executar(id: string) {
    const agendamentos = await this.agendamentosRepository.findByUserId(id);
    
    if (!agendamentos) {
      throw new Error('erro ao procurar agedamento por user id');
    }    

    return agendamentos;

  }
}


export class AcharPorPrestadorId {
  constructor(private agendamentosRepository: IAgendamentosRepository) {}

  async executar(id: string) {
    const agendamentos = await this.agendamentosRepository.findByPrestadorId(id);
    
    if (!agendamentos) {
      throw new Error('erro ao procurar agedamento por prestador id');
    }    

    return agendamentos;

  }
}
