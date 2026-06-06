import { Request, Response } from "express";

import {
  CriarEnderecoUseCase,
  DeletarEnderecoUseCase,
  AtualizarEnderecoUseCase,
  AcharPorUserId,
  AcharPorPrestadorId,
  AcharPorCidade,
  SetarPrincipal,
  UnsetarPrincipal,
} from "../../core/use-cases/endereco/EnderecoUseCase";
import { BuscarCepUseCase } from "../../core/use-cases/endereco/BuscarCepUseCase";
import { CalcularDistanciaUseCase } from "../../core/use-cases/endereco/CalcularDistanciaUseCase";

import { CriarEnderecoDto } from "../../core/dtos/endereco";
import { Endereco } from "../../core/entities/Endereco";

export class EnderecoController {
  constructor(
    private criarEndereco: CriarEnderecoUseCase,
    private deletarEndereco: DeletarEnderecoUseCase,
    private atualizarEndereco: AtualizarEnderecoUseCase,
    private acharPorUserId: AcharPorUserId,
    private acharPorPrestadorId: AcharPorPrestadorId,
    private acharPorCidade: AcharPorCidade,
    private setPrincipal: SetarPrincipal,
    private unsetPrincipal: UnsetarPrincipal,
    private buscarCep: BuscarCepUseCase,
    private calcularDistancia: CalcularDistanciaUseCase,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      const endereco = req.body;
      const resultado = await this.criarEndereco.executar(endereco);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const resultado = await this.deletarEndereco.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const endereco = req.body.endereco;
      const id = req.body.id;
      const resultado = await this.atualizarEndereco.executar(endereco);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      // rota GET: aceita ?id= na query (e mantém body por compatibilidade)
      const id = (req.query.id as string) ?? req.body?.id;
      const resultado = await this.acharPorUserId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByPrestadorId(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const resultado = await this.acharPorPrestadorId.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async findByCity(req: Request, res: Response) {
    try {
      const cidade = req.body.cidade;
      const resultado = await this.acharPorCidade.executar(cidade);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async setIsPrincipal(req: Request, res: Response) {
    try {
      const resultado = await this.setPrincipal.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async unsetIsPrincipal(req: Request, res: Response) {
    try {
      const resultado = await this.unsetPrincipal.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async getCep(req: Request, res: Response) {
    try {
      // rota GET: aceita ?cep= na query (e mantém body por compatibilidade)
      const cep = (req.query.cep as string) ?? req.body?.cep;
      const resultado = await this.buscarCep.executar(cep);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async getDistancia(req: Request, res: Response) {
    try {
      const { user_id, prestador_id } = req.query as { user_id: string; prestador_id: string };
      const resultado = await this.calcularDistancia.executar(user_id, prestador_id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }
}
