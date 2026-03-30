import { IServicoRepository } from '../../repositories/IServicoRepository';

import { CriarServicoDto, ServicoStatus } from '../../dtos/servico';

import { Servico } from '../../entities/Servico';


export class CriarServicoUseCase {
  constructor(
    private servicoRepository: IServicoRepository,
) {}
//
//  async executar(dados: CriarServicoDto) {
 //    const client = await pool.connect();
// 
   //  try {
 //      await client.query('BEGIN');
// 
  //     const agendamento = new Agendamento(dados.criarAgendamento);
 //      const transacao = new Transacao(dados.criarTransacao);
// 
   //    await this.agendamentosRepository.create(agendamento, client);
 //      await this.transacaoRepository.create(transacao, client);
// 
 //      const servico = new Servico({
 //        ...dados.criarServico,
 //      });
   //    await this.servicoRepository.create(servico, client);
 //  
 //      await client.query('COMMIT');
   //    return servico;
// 
 //    } catch (error) {
   //    await client.query('ROLLBACK');
    //   throw error;
 //    }
  //   finally {
   //    client.release();
   //  }
 //  }
// }
  async executar(dados: CriarServicoDto) {
    const servico = new Servico(dados);

    const servicoCriado = await this.servicoRepository.create(servico);

    if (!servicoCriado) {
      throw new Error('Falha ao criar servico');
    }

    return servicoCriado;
  }
}

export class PesquisarServicoId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    const servico2 = await this.servicoRepository.findById(id);

    if (!servico2){
      throw new Error('Erro ao pesquisar o servico pelo servico id');
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
      throw new Error('Erro ao pesquisar por user id o servico');
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
      throw new Error('Erro pesquisar por prestador id o servico');
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
