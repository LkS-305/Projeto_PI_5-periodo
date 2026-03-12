import { Request, Response } from 'express';
import { CriarCarteiraUseCase, DeletarCarteiraUseCase, AtualizarMetodosDePagamentoUseCase, AtualizarStatus, AtualizarSaldoUseCase, AcharPorUserId, AcharPorPrestadorId } from '../../core/use-cases/financeiro/CarteiraUseCase';

export class CarteiraController {
  constructor(
    private criarCarteira: CriarCarteiraUseCase,
    private deletarCarteira: DeletarCarteiraUseCase,
    private atualizarMetodosDePagamento: AtualizarMetodosDePagamentoUseCase,
    private atualizarStatus: AtualizarStatus,
    private atualizarSaldo: AtualizarSaldoUseCase,
    private acharPorUserId: AcharPorUserId,
    private acharPorPrestadorId: AcharPorPrestadorId
  ) {}


  async create(req: Request, res: Response){
    try {
        const resultado = await this.criarCarteira.executar(req.body);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const resultado = await this.deletarCarteira.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async updatePaymentMethods(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarMetodosDePagamento.executar(req.body.id, req.body.dados);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async updateStatus(req: Request, res: Response){
    try {
      const resultado = await this.atualizarStatus.executar(req.body.id, req.body.status);
      return res.status(201).json(resultado);

    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
}


  async updateBalance(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarSaldo.executar(req.body.id, req.body.saldo);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}


  async findByUserId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorUserId.executar(req.body.id);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}

  async findByPrestadorId(req: Request, res: Response) {
    try {
      const resultado = await this.acharPorPrestadorId.executar(req.body.id);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}





  
}
