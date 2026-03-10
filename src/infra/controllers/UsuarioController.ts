import { Response, Request } from 'express';
import { CriarUsuarioUseCase, PesquisarUsuarioUseCase, DeletarUsuarioUseCase} from '../../core/use-cases/usuario/UsuarioUseCase';
import { LoginUsuarioUseCase } from '../../core/use-cases/autenticacao/LoginUsuarioUseCase';




export class UsuarioController {
  constructor(
    private criarUsuario: CriarUsuarioUseCase,
    private loginUsuario: LoginUsuarioUseCase,
    private pesquisarUsuario: PesquisarUsuarioUseCase,
    private deletarUsuarioUseCase: DeletarUsuarioUseCase
  ){}

  async criar(req: Request, res: Response){
    try {
        const resultado = await this.criarUsuario.executar(req.body);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
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
      const resultado = await this.pesquisarUsuario.executar(req.body);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}

  async deletar(req: Request, res: Response) {
    try {
      const resultado = await this.deletarUsuarioUseCase.executar(req.body);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }








}
