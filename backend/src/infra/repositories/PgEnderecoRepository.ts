import { IEnderecoRepository } from "../../core/repositories/IEnderecoRepository";

import { Endereco } from "../../core/entities/Endereco";
import { pool } from "../database/postgres";

export class PgEnderecoRepository implements IEnderecoRepository {
  async create(endereco: Endereco): Promise<Endereco> {
    const { rows } = await pool.query(
      `INSERT INTO enderecos (id, user_id, rotulo, logradouro, numero, complemento, bairro, cidade, estado, cep, is_principal)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        endereco.user_id,
        endereco.rotulo,
        endereco.logradouro,
        endereco.numero,
        endereco.complemento ?? null,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep,
        endereco.is_principal,
      ],
    );
    return rows[0];
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM enderecos WHERE id = $1", [id]);
  }

  async update(endereco: Endereco): Promise<Endereco | null> {
    const { rows } = await pool.query(
      `UPDATE enderecos
       SET rotulo = $1, logradouro = $2, numero = $3, complemento = $4, bairro = $5, cidade = $6, estado = $7, cep = $8, is_principal = $9
       WHERE id = $10
       RETURNING *;`,
      [
        endereco.rotulo,
        endereco.logradouro,
        endereco.numero,
        endereco.complemento ?? null,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep,
        endereco.is_principal,
        endereco.id,
      ],
    );
    return rows[0] ?? null;
  }

  async findById(id: string): Promise<Endereco | null> {
    const { rows } = await pool.query(
      "SELECT * FROM enderecos WHERE id = $1",
      [id],
    );
    return rows[0] ?? null;
  }

  async findByUserId(id: string): Promise<Endereco | null> {
    const { rows } = await pool.query(
      "SELECT * FROM enderecos WHERE user_id = $1 AND is_principal = true LIMIT 1",
      [id],
    );
    return rows[0] ?? null;
  }

  async findByPrestadorId(prestador_id: string): Promise<Endereco | null> {
    const { rows } = await pool.query(
      "SELECT * FROM enderecos WHERE user_id = $1 AND is_principal = true LIMIT 1",
      [prestador_id],
    );
    return rows[0] ?? null;
  }

  async findByCity(cidade: string): Promise<Endereco[] | null> {
    const { rows } = await pool.query(
      "SELECT * FROM enderecos WHERE cidade = $1",
      [cidade],
    );
    return rows;
  }

  async setIsPrincipal(id: string): Promise<void> {
    await pool.query("UPDATE enderecos SET is_principal = true WHERE id = $1", [id]);
  }

  async unsetIsPrincipal(id: string): Promise<void> {
    await pool.query("UPDATE enderecos SET is_principal = false WHERE id = $1", [id]);
  }
}
