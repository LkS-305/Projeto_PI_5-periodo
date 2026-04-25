import { pool } from "../database/postgres";
import { Usuario } from "../../core/entities/Usuario";
import { IUsuarioRepository } from "../../core/repositories/IUsuarioRepository";
import { AppError } from "../../core/errors/AppError";

export class PgUsuarioRepository implements IUsuarioRepository {
  async create(usuario: Usuario): Promise<void> {
    const consulta = `
      INSERT INTO usuarios (user_id, nome, score, foto_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;
    const valores = [
      usuario.user_id,
      usuario.nome,
      usuario.score,
      usuario.foto_url,
    ];

    try {
      await pool.query(consulta, valores);
    } catch (error: any) {

      // Erro de violação de restrição única (Ex: Email ou CPF já existem)
      if (error.code === '23505') {

        const detail = error.detail; // O Postgres costuma dizer qual campo falhou
        if (detail.includes('user_id')) {
          throw new AppError('Este user_id ja esta em uso.', 400);
        }
      }

    // Erro genérico de banco (Conexão, sintaxe, etc)
    console.error('Database Error:', error);
    throw new AppError('Erro interno ao processar o cadastro no banco de dados.', 500);
   }
  }

  async delete(id: string): Promise<void> {
    const { rows } = await pool.query(
      "DELETE * FROM usuarios WHERE user_id = $1 RETURNING *",
      [id],
    );
    return rows[0];
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
    console.error(error);
    throw new AppError("Erro de sintaxe na atualização: " + error.message);
  }
  }

  async findByUserId(user_id: string): Promise<Usuario | null> {
    console.log('procurando no banco pelpo user_id: ', user_id);
    const consulta = "SELECT * FROM usuarios WHERE user_id = $1"; // Sem vírgula, sem RETURNING
  
try {
    const { rows } = await pool.query(consulta, [user_id]);
      console.log('aaaaaaaa',rows[0]);
    return rows[0] || null;
  } catch (error: any) {
    // Esse log vai aparecer no terminal onde o SERVIDOR (npm run dev) está rodando
    console.error("ERRO NA QUERY:", consulta);
    console.error("MENSAGEM:", error.message);
    throw error;
  }
 }
}
