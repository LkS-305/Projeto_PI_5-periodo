import { Response, Request } from "express";
import {
  CriarUsuarioUseCase,
  DeletarUsuarioUseCase,
  AtualizarUsuarioUseCase,
  PesquisarPorUserId,
} from "../../core/use-cases/usuario/UsuarioUseCase";

export class UsuarioController {
  constructor(
    private criarUsuario: CriarUsuarioUseCase,
    private deletarUsuario: DeletarUsuarioUseCase,
    private atualizarUsuario: AtualizarUsuarioUseCase,
    private pesquisarPorUserId: PesquisarPorUserId,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      const resultado = await this.criarUsuario.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const resultado = await this.deletarUsuario.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarUsuario.executar(req.body.dados);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      const resultado = await this.pesquisarPorUserId.executar(req.body.id);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }
}
