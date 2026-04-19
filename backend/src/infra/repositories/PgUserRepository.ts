import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";
import { pool } from "../database/postgres";
import { LoginDto } from "../../core/dtos/user";

export class PgUserRepository implements IUserRepository {
  async register(usuario: User): Promise<Omit<User, "senha"> | null> {
    const consulta = `
        INSERT INTO usuarios (id, nome, email, senha, cpf)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, nome, email, cpf;
      `;
    const valores = [usuario.id, usuario.email, usuario.senha, usuario.cpf];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  }

  async login(props: LoginDto): Promise<Omit<User, "senha"> | null> {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [props.email],
    );
    return rows[0] || null;
  }

  async updateRecoveryToken(
    usuario_id: string,
    codigo: string | null,
    expiracao: Date | null,
  ): Promise<void> {
    const query = `
        UPDATE usuarios 
        SET recovery_token = $1, 
            recovery_token_expires = $2 
        WHERE id = $3
      `;
    const values = [codigo, expiracao, usuario_id];

    await pool.query(query, values);
  }

  async changePassword(id: string, nova_senha_hash: string): Promise<void> {
    const query = `
        UPDATE usuarios 
        SET senha = $1 
        WHERE id = $2
      `;
    const values = [nova_senha_hash, id];

    await pool.query(query, values);
  }

  async delete(id: string) {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    return rows[0];
  }

  async update(dados: User): Promise<void> {
    const query = `
        UPDATE users 
        SET 
            nome = $1, 
            email = $2, 
            senha = $3
        WHERE id = $4
        RETURNING *
    `;

    const values = [dados.email, dados.senha, dados.cpf, dados.id];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  }
}
