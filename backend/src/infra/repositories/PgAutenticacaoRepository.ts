import { pool } from '../database/postgres';
import { IAutenticacaoRepository } from '../../core/repositories/IAutenticacaoRepository';
import { LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '../../core/dtos/autenticacao';
import { User } from '../../core/entities/User';

export class PgAutenticacaoRepository implements IAutenticacaoRepository {

  async register(usuario: User): Promise<Omit<User, 'senha'> | null> {
    const consulta = `
      INSERT INTO usuarios (id, nome, email, senha, cpf)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, cpf;
    `;
    const valores = [usuario.id, usuario.nome, usuario.email, usuario.senha, usuario.cpf];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  }

  async login(props: LoginDto): Promise<Omit<User, 'senha'> | null> {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [props.email]);
    return rows[0] || null;
  }

  async updateRecoveryToken(
    usuario_id: string, 
    codigo: string | null, 
    expiracao: Date | null
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
}
