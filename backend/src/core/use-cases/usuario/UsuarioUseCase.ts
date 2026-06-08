import { AtualizarUsuarioDto } from "../../dtos/usuario";
import { Usuario } from "../../entities/Usuario";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsuarioRepository } from "../../repositories/IUsuarioRepository";
import { ResourceNotFoundError } from "../../errors/AppError";
import { validarUUID, validarEmail } from "../../utils/validate";

export class CriarUsuarioUseCase {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private userRepository: IUserRepository,
  ) {}

  async executar(
    user_id: string,
    nome: string,
    telefone?: string,
  ): Promise<Usuario> {
    const userExistente = await this.userRepository.findById(user_id);

    if (!userExistente) {
      throw new ResourceNotFoundError("User");
    }

    /** O registro (`RegisterUseCase`) já cria uma linha em `usuarios` com nome provisório.
     * O fluxo de cadastro completo chama `criarUsuario` em seguida — aqui fazemos upsert lógico. */
    const perfilExistente = await this.usuarioRepository.findByUserId(user_id);
    if (perfilExistente) {
      const instancia = new Usuario(perfilExistente);
      instancia.atualizarPerfil({ user_id, nome, telefone });
      await this.usuarioRepository.update(instancia);
      return instancia;
    }

    const usuario = new Usuario({ user_id, nome, telefone });
    await this.usuarioRepository.create(usuario);

    return usuario;
  }
}

export class DeletarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(user_id: string): Promise<boolean> {
    validarUUID(user_id, "ID do usuário");
    const usuario = await this.usuarioRepository.findByUserId(user_id);

    if (!usuario) {
      throw new ResourceNotFoundError("Usuario");
    }

    await this.usuarioRepository.delete(user_id);
    return true;
  }
}

export class AtualizarUsuarioUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(dados: AtualizarUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findByUserId(dados.user_id);

    if (!usuario) {
      throw new ResourceNotFoundError("usuario");
    }
    const usuarioInstanciado = new Usuario(usuario);
    usuarioInstanciado.atualizarPerfil(dados);
    await this.usuarioRepository.update(usuarioInstanciado);
    return usuarioInstanciado;
  }
}

export class PesquisarPorUserId {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async executar(user_id: string): Promise<Usuario | null> {
    validarUUID(user_id, "ID do usuário");
    const usuario = await this.usuarioRepository.findByUserId(user_id);

    if (!usuario) {
      throw new ResourceNotFoundError("Usuário");
    }
    return usuario;
  }
}
