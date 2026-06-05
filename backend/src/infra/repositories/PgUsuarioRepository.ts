import { pool } from "../database/postgres";
import { Usuario } from "../../core/entities/Usuario";
import { IUsuarioRepository } from "../../core/repositories/IUsuarioRepository";
import { AppError } from "../../core/errors/AppError";

export class PgUsuarioRepository implements IUsuarioRepository {
  async create(usuario: Usuario): Promise<void> {
    const consulta = `
      INSERT INTO usuarios (user_id, nome)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const valores = [usuario.user_id, usuario.nome];

    try {
      await pool.query(consulta, valores);
    } catch (error: any) {
      if (error.code === "23505") {
        const detail = error.detail;
        if (detail?.includes("user_id")) {
          throw new AppError("Este user_id ja esta em uso.", 400);
        }
      }
      throw new AppError("Erro interno ao processar o cadastro no banco de dados.", 500);
    }
  }

  async delete(user_id: string): Promise<void> {
    const query = "DELETE FROM usuarios WHERE user_id = $1";
    await pool.query(query, [user_id]);
  }

  async update(dados: Usuario): Promise<void> {
    const consulta = `
        UPDATE usuarios 
        SET nome = $1,
            foto_url = $2
        WHERE user_id = $3
        RETURNING *
    `;
    const valores = [dados.nome, dados.foto_url, dados.user_id];

    try {
      await pool.query(consulta, valores);
    } catch (error: any) {
      throw new AppError("Erro de sintaxe na atualização: " + error.message);
    }
  }

  async findByUserId(user_id: string): Promise<Usuario | null> {
    const consulta = "SELECT * FROM usuarios WHERE user_id = $1";
    const { rows } = await pool.query(consulta, [user_id]);
    return rows[0] || null;
  }
}
