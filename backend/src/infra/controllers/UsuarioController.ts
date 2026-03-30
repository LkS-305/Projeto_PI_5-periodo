import { Response, Request } from 'express';
import { CriarUsuarioUseCase, DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorId, PesquisarPorEmail} from '../../core/use-cases/usuario/UsuarioUseCase';
import { LoginUseCase } from '../../core/use-cases/autenticacao/LoginUsuarioUseCase';




export class UsuarioController {
  constructor(
    private criarUsuario: CriarUsuarioUseCase,
    private deletarUsuario: DeletarUsuarioUseCase,
    private atualizarUsuario: AtualizarUsuarioUseCase,
    private pesquisarPorId: PesquisarPorId,
    private pesquisarPorNome: PesquisarPorEmail,
    private loginUsuario: LoginUseCase
  ){}

  async criar(req: Request, res: Response){
    try {
        const resultado = await this.criarUsuario.executar(req.body);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const resultado = await this.deletarUsuario.executar(req.body.id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const resultado = await this.atualizarUsuario.executar(req.body.id, req.body.dados);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async login(req: Request, res: Response){
    try {
      const resultado = await this.loginUsuario.executar(req.body);
      return res.status(201).json(resultado);

    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
}


  async findById(req: Request, res: Response) {
    try {
      const resultado = await this.pesquisarPorId.executar(req.body.id);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}


  async findByName(req: Request, res: Response) {
    try {
      const resultado = await this.pesquisarPorNome.executar(req.body.nome);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}

}
