import { IServicoRepository } from '../../repositories/IServicoRepository';
import { CriarServicoDto, AtualizarServicoDto, AtualizarStatusServicoDto } from '../../dtos/servico';
import { Servico } from '../../entities/Servico';
import { ResourceNotFoundError, ValidationError } from '../../errors/AppError';
import { validarUUID, validarTexto, sanitizarTexto, validarPreco, validarDataFutura, validarDuracao } from '../../utils/validate';


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
    validarTexto(dados.titulo, 'Título', 3, 100);
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
    const servico2 = await this.servicoRepository.findByPrestadorId(id);

    if (!servico2){
      throw new ResourceNotFoundError('Serviço');
    }
    return servico2;
  }
}


export class ListarServicosUseCase {
  constructor(private servicoRepository: IServicoRepository) {}

  async executar(): Promise<Servico[]> {
    return this.servicoRepository.findAll();
  }

  async stats() {
    return this.servicoRepository.getStats();
  }
}

export class AtualizarStatusUseCase {
  constructor(
    private servicoRepository: IServicoRepository
) {}

  async executar(dados : AtualizarStatusServicoDto) {
    validarUUID(dados.id, 'ID do serviço');
    await this.servicoRepository.updateStatus(dados);
  }
} 

export class AtualizarServicoUseCase{
  constructor(private servicoRepository : IServicoRepository) {}

  async executar(dados : AtualizarServicoDto){
    validarUUID(dados.id, 'ID do serviço');
    if(dados.titulo !== undefined) {
      validarTexto(dados.titulo, 'Título', 3, 100);
      dados.titulo = sanitizarTexto(dados.titulo);
    }
    if(dados.descricao !== undefined) {
      validarTexto(dados.descricao, 'Descrição', 0, 500);
      dados.descricao = sanitizarTexto(dados.descricao);
    }
    if(dados.categoria !== undefined) {
      validarTexto(dados.categoria, 'Categoria', 2, 60);
      dados.categoria = sanitizarTexto(dados.categoria);
    }
    if(dados.preco_acordado !== undefined) {
      validarPreco(dados.preco_acordado);
    }
    if(dados.data_inicio !== undefined) {
      validarDataFutura(dados.data_inicio);
    }
    if(dados.duracao !== undefined) {
      validarDuracao(dados.duracao);
    }

    return await this.servicoRepository.updateServico(dados);
  }

}
