import { IUsuarioRepository } from "../../src/core/repositories/IUsuarioRepository";
import { Usuario } from "../../src/core/entities/Usuario";
import { CriarUsuarioDto } from "../../src/core/dtos/usuario";

export class InMemoryUsuarioRepository implements IUsuarioRepository {
  public items: Usuario[] = [];

  async create(usuario: CriarUsuarioDto): Promise<Usuario> {
    this.items.push(usuario as Usuario);
    return usuario as Usuario;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((u) => u.user_id === id);
    if (index === -1) return;
    this.items.splice(index, 1);
  }

  async update(novoUsuario: Usuario): Promise<void> {
    const index = this.items.findIndex(
      (u) => u.user_id === novoUsuario.user_id,
    );

    if (index === -1) return;
    // Atualiza a lista em memória
    this.items[index] = novoUsuario;
  }

  async findByUserId(user_id: string): Promise<Usuario | null> {
    const user = this.items.find((u) => u.user_id === user_id);
    return user || null;
  }
}
