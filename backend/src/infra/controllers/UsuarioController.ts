import { Response, Request } from 'express';
import { DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorId, PesquisarPorEmail} from '../../core/use-cases/usuario/UsuarioUseCase';
import { AppError } from '../../core/errors/AppError';


export class UsuarioController {
  constructor(
    private deletarUsuario: DeletarUsuarioUseCase,
    private atualizarUsuario: AtualizarUsuarioUseCase,
    private pesquisarPorId: PesquisarPorId,
    private pesquisarPorNome: PesquisarPorEmail,
  ){}

  async deletar(req: Request, res: Response) {
    try {
      const resultado = await this.deletarUsuario.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarUsuario.executar(req.body.id, req.body.dados);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const resultado = await this.pesquisarPorId.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

  async findByName(req: Request, res: Response) {
    try {
      const resultado = await this.pesquisarPorNome.executar(req.body.nome);
      return res.status(200).json(resultado);
    } catch (erro: unknown) {
      if (erro instanceof AppError) {
        return res.status(erro.statusCode).json({ status: 'error', message: erro.message });
      }
      return res.status(500).json({ status: 'error', message: 'Erro interno no servidor.' });
    }
  }

}
