import { Response, Request } from 'express';
import { CriarUsuarioUseCase, DeletarUsuarioUseCase, AtualizarUsuarioUseCase, PesquisarPorUserId} from '../../core/use-cases/usuario/UsuarioUseCase';


export class UsuarioController {
  constructor(
    private criarUsuario: CriarUsuarioUseCase,
    private deletarUsuario: DeletarUsuarioUseCase,
    private atualizarUsuario: AtualizarUsuarioUseCase,
    private pesquisarPorUserId: PesquisarPorUserId,
  ) {}

  async criar(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({ erro: "User não identificado no jwt." });
    }
      const { id } = req.user
      const resultado = await this.criarUsuario.executar(id, req.body.nome, req.body.foto_url);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({ erro: "Usuário não identificado no jwt." });
    }

      const {id} = req.user

      if (id != req.body.id) throw new Error('Usuario tentando apagar outro usuario');
      const resultado = await this.deletarUsuario.executar(id);
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      if (!req.user) {
      return res.status(401).json({ erro: "User não identificado no jwt." });
    }
      const {id} = req.user;
      const resultado = await this.atualizarUsuario.executar({user_id: id, nome: req.body.nome, foto_url: req.body.url});
      return res.status(200).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message})
    }
  }

  async findByUserId(req: Request, res: Response) {
    try {
      if(!req.body.user_id) {
        throw new Error('Id necessario no body');
      }
      const resultado = await this.pesquisarPorUserId.executar(req.body.user_id);
      return res.status(201).json(resultado);
    } catch (erro: any) {
      return res.status(400).json({erro: erro.message});
    }
}
}
