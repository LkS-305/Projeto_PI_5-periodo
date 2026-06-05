import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";
import { pool } from "../database/postgres";
import { LoginDto } from "../../core/dtos/user";
import { AppError } from '../../core/errors/AppError';

export class PgUserRepository implements IUserRepository {
  async register(usuario: User): Promise<void> {
    const consulta = `
        INSERT INTO users (id, email, senha, cpf)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, cpf;
      `;
    const valores = [usuario.id, usuario.email, usuario.senha, usuario.cpf];
    try {
      await pool.query(consulta, valores);
    } catch (error: any) {

      // Erro de violação de restrição única (Ex: Email ou CPF já existem)
      if (error.code === '23505') {

        const detail = error.detail; // O Postgres costuma dizer qual campo falhou
        if (detail.includes('id')) {
          throw new AppError('Este id ja esta em uso.', 400);
        }
        if (detail.includes('email')) {
          throw new AppError('Este e-mail já está em uso.', 400);
        }
        if (detail.includes('cpf')) {
          throw new AppError('Este CPF já está cadastrado.', 400);
        }
      }

    // Erro genérico de banco (Conexão, sintaxe, etc)
    console.error('Database Error:', error);
    throw new AppError('Erro interno ao processar o cadastro no banco de dados.', 500);
   }    
  }

  async login(props: LoginDto): Promise<Omit<User, "senha"> | null> {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
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
        UPDATE users 
        SET recovery_token = $1, 
            recovery_token_expires = $2 
        WHERE id = $3
      `;
    const values = [codigo, expiracao, usuario_id];

    await pool.query(query, values);
  }

  async changePassword(id: string, nova_senha_hash: string): Promise<void> {
    const query = `
        UPDATE users 
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
            email = $1, 
            senha = $2,
            cpf = $3
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
