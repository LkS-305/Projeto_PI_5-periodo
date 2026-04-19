import { pool } from "../database/postgres";
import { Usuario } from "../../core/entities/Usuario";
import { IUsuarioRepository } from "../../core/repositories/IUsuarioRepository";

export class PgUsuarioRepository implements IUsuarioRepository {
  async create(usuario: Usuario): Promise<Usuario> {
    const query = `
      INSERT INTO usuarios (id, user_id, nome, score, foto_url, created_at, updated_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      usuario.user_id,
      usuario.nome,
      usuario.score,
      usuario.foto_url,
    ]);
    return rows[0];
  }

  async delete(id: string) {
    const { rows } = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [id],
    );
    return rows[0];
  }

  async update(dados: Usuario): Promise<void> {
    const query = `
        UPDATE usuarios 
        SET 
            nome = $1,
            foto_url = $2, 
        WHERE user_id = $3
        RETURNING *
    `;

    const values = [dados.nome, dados.foto_url, dados.user_id];

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  async findByUserId(user_id: string): Promise<Usuario | null> {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE user_id = $1",
      [user_id],
    );
    return rows[0] || null;
  }
}
