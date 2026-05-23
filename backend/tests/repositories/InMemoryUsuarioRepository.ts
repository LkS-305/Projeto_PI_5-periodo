import { IUsuarioRepository } from "../../src/core/repositories/IUsuarioRepository";
import { Usuario } from "../../src/core/entities/Usuario";
import { CriarUsuarioDto } from "../../src/core/dtos/usuario";

export class InMemoryUsuarioRepository implements IUsuarioRepository {
  public items: Usuario[] = [];

  async create(usuario: CriarUsuarioDto): Promise<void> {
    const novo = new Usuario(usuario);
    this.items.push(novo);
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((u) => u.user_id === id);
    if (index === -1) return;
    this.items.splice(index, 1);
  }

  async update(dados: Usuario): Promise<void> {
    const index = this.items.findIndex((u) => u.user_id === dados.user_id);
    if (index === -1) return;
    Object.assign(this.items[index], dados);
  }

  async findByUserId(user_id: string): Promise<Usuario | null> {
    const user = this.items.find((u) => u.user_id === user_id);
    return user || null;
  }

  async findByEmail(email: string | undefined): Promise<Usuario | null> {
    return null;
  }

  async findById(id: string): Promise<Usuario | null> {
    const user = this.items.find((u) => u.user_id === id);
    return user || null;
  }
}
