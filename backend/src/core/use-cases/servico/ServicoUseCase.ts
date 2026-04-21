import { IServicoRepository } from '../../repositories/IServicoRepository';
import { CriarServicoDto, ServicoStatus } from '../../dtos/servico';
import { Servico } from '../../entities/Servico';
import { ResourceNotFoundError, ValidationError } from '../../errors/AppError';
import { validarUUID, validarTexto, sanitizarTexto } from '../../utils/validate';


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
    validarUUID(dados.user_id, 'ID do usuário');
    validarUUID(dados.prestador_id, 'ID do prestador');
    validarTexto(dados.titulo, 'Título', 3, 100);
    validarTexto(dados.categoria, 'Categoria', 2, 60);
    dados.titulo = sanitizarTexto(dados.titulo);

    const servico = new Servico(dados);

    const servicoCriado = await this.servicoRepository.create(servico);

    if (!servicoCriado) {
      throw new ValidationError('Falha ao criar serviço.');
    }

    return servicoCriado;
  }
}

export class PesquisarServicoId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    validarUUID(id, 'ID do serviço');
    const servico2 = await this.servicoRepository.findById(id);

    if (!servico2){
      throw new ResourceNotFoundError('Serviço');
    }

    return servico2;
  }
}

export class PesquisarServicoUserId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    validarUUID(id, 'ID do usuário');
    const servico2 = await this.servicoRepository.findByUserId(id);

    if (!servico2){
      throw new ResourceNotFoundError('Serviço');
    }

    return servico2;
  }
}


export class PesquisarServicoPrestadorId {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string) {
    validarUUID(id, 'ID do prestador');
    const servico2 = await this.servicoRepository.findByPrestadorId(id);

    if (!servico2){
      throw new ResourceNotFoundError('Serviço');
    }

    return servico2;
  }
}


export class UpdateStatusUseCase {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(id: string, status: ServicoStatus) {
    validarUUID(id, 'ID do serviço');
    await this.servicoRepository.updateStatus(id, status);
  }
} 
