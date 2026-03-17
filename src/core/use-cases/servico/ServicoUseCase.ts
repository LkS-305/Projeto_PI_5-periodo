import { IServicoRepository } from '../../repositories/IServicoRepository';
import { IAgendamentoRepository } from '../../repositories/IAgendamentoRepository';
import { ITransacaoRepository } from '../../repositories/ITransacaoRepository';

import { CriarServicoDto, ServicoStatus } from '../../dtos/servico';

import { Servico } from '../../entities/Servico';
import { Transacao } from '../../entities/Transacao';
import { Agendamento } from '../../entities/Agendamento';

import { pool } from '../../../infra/database/postgres';


export class CriarServicoUseCase {
  constructor(
    private servicoRepository: IServicoRepository,
    private agendamentoRepository: IAgendamentoRepository,
    private transacaoRepository: ITransacaoRepository
) {}

  async executar(dados: CriarServicoDto) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const agendamento = new Agendamento(dados.criarAgendamento);
      const transacao = new Transacao(dados.criarTransacao);

      await this.agendamentoRepository.save(agendamento, client);
      await this.transacaoRepository.save(transacao, client);

      const servico = new Servico({
        ...dados.criarServico,
        id_agendamento: agendamento.id,
        id_transacao: transacao.id
      });
      await this.servicoRepository.create(servico, client);
  
      await client.query('COMMIT');
      return servico;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
    finally {
      client.release();
    }
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
