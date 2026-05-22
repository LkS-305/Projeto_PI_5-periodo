import { ICarteiraRepository } from "../../core/repositories/ICarteiraRepository";
import { Carteira } from "../../core/entities/Carteira";
import { pool } from "../database/postgres";
import { CriarCarteiraDto } from "../../core/dtos/carteira";

export class PgCarteiraRepository implements ICarteiraRepository {
  async create(carteira: CriarCarteiraDto): Promise<void> {
    const consulta = `
      INSERT INTO carteiras (
        id, usuario_id, prestador_id, saldo, metodos_de_pagamento
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4)
      RETURNING *;
    `;
    const valores = [
      carteira.usuario_id ?? null,
      carteira.prestador_id ?? null,
      carteira.saldo ?? "0.00",
      carteira.metodos_de_pagamento ?? null,
    ];
    await pool.query(consulta, valores);
  }

  async delete(id: string): Promise<void> {
    await pool.query("DELETE FROM carteiras WHERE id = $1", [id]);
  }

  async updatePaymentMethods(id: string, methods: string): Promise<void> {
    await pool.query(
      "UPDATE carteiras SET metodos_de_pagamento = $1 WHERE id = $2",
      [methods, id],
    );
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await pool.query("UPDATE carteiras SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
  }

  async updateBalance(id: string, balance: string): Promise<void> {
    await pool.query("UPDATE carteiras SET saldo = $1 WHERE id = $2", [
      balance,
      id,
    ]);
  }

  async findByUserId(usuario_id: string): Promise<Carteira | null> {
    const { rows } = await pool.query(
      "SELECT * FROM carteiras WHERE usuario_id = $1",
      [usuario_id],
    );
    return rows[0] || null;
  }

  async findByPrestadorId(prestador_id: string): Promise<Carteira | null> {
    const { rows } = await pool.query(
      "SELECT * FROM carteiras WHERE prestador_id = $1",
      [prestador_id],
    );
    return rows[0] || null;
  }
}
