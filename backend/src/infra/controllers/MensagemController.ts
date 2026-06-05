import { Request, Response } from "express";
import {
  EnviarMensagemUseCase,
  BuscarMensagensServicoUseCase,
  BuscarMensagensUsuarioUseCase,
  BuscarMensagensPrestadorUseCase,
  MarcarMensagemLidaUseCase,
} from "../../core/use-cases/mensagem/MensagemUseCase";
import { logControllerError } from "../../core/utils/httpLogger";

export class MensagemController {
  constructor(
    private enviarMensagem: EnviarMensagemUseCase,
    private buscarPorServico: BuscarMensagensServicoUseCase,
    private buscarPorUsuario: BuscarMensagensUsuarioUseCase,
    private buscarPorPrestador: BuscarMensagensPrestadorUseCase,
    private marcarLida: MarcarMensagemLidaUseCase,
  ) {}

  async enviar(req: Request, res: Response) {
    try {
      // remetente_id vem do token JWT (req.user.id), não do body
      const remetente_id = req.user!.id;
      const resultado = await this.enviarMensagem.executar({
        ...req.body,
        remetente_id,
      });
      return res.status(201).json(resultado);
    } catch (erro: any) {
      logControllerError('MensagemController', 'enviar', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listarPorServico(req: Request, res: Response) {
    try {
      const servico_id = Array.isArray(req.params.servico_id)
        ? req.params.servico_id[0]
        : req.params.servico_id;
      if (!servico_id)
        return res.status(400).json({ erro: "servico_id ausente" });
      const resultado = await this.buscarPorServico.executar(servico_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('MensagemController', 'listarPorServico', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listarPorUsuario(req: Request, res: Response) {
    try {
      const user_id = req.user!.id;
      const resultado = await this.buscarPorUsuario.executar(user_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('MensagemController', 'listarPorUsuario', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listarPorPrestador(req: Request, res: Response) {
    try {
      const prestador_id = Array.isArray(req.params.prestador_id)
        ? req.params.prestador_id[0]
        : req.params.prestador_id;
      if (!prestador_id)
        return res.status(400).json({ erro: "prestador_id ausente" });
      const resultado = await this.buscarPorPrestador.executar(prestador_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      logControllerError('MensagemController', 'listarPorPrestador', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }

  async marcarComoLida(req: Request, res: Response) {
    try {
      const remetente_id = req.user!.id;
      const mensagem_id = Array.isArray(req.params.mensagem_id)
        ? req.params.mensagem_id[0]
        : req.params.mensagem_id;
      if (!mensagem_id)
        return res.status(400).json({ erro: "mensagem_id ausente" });
      await this.marcarLida.executar({ mensagem_id, remetente_id });
      return res.status(204).send();
    } catch (erro: any) {
      logControllerError('MensagemController', 'marcarComoLida', erro);
      return res.status(400).json({ erro: erro.message });
    }
  }
}
