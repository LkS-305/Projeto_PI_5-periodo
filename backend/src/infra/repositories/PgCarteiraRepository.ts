import { ICarteiraRepository } from '../../core/repositories/ICarteiraRepository';
import { Carteira } from '../../core/entities/Carteira';

import { pool } from '../database/postgres';
import { CriarCarteiraDto } from '../../core/dtos/carteira';


export class PgCarteiraRepository implements ICarteiraRepository {


   async create(carteira: Carteira): Promise<void> {
    const consulta = `
      INSERT INTO carteiras (user_id, saldo, numero_cartao, validade_cartao, nome_cartao, vcc_cartao) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const valores = [
      carteira.user_id, 
      carteira.saldo, 
      carteira.numero_cartao,
      carteira.validade_cartao,
      carteira.nome_cartao,
      carteira.vcc_cartao
    ];
    await pool.query(consulta, valores);
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE * FROM carteias WHERE id = $1', [id]);
  }

  async updatePaymentMethods(id: string, methods: string): Promise<void> {
    await pool.query('UPDATE carteiras SET metodos_de_pagamento = $1 WHERE id = $2', [methods, id]);
  }

  async updateStatus(id: string, status: string ): Promise<void> {
    await pool.query('UPDATE carteiras SET status = $1 WHERE id = $2', [status, id]);
  }

  async updateBalance(id: string, balance: string): Promise<void> {
    await pool.query('UPDATE carteiras SET balance = $2 WHERE id = $1', [id, balance]);
  }

  async findByUserId(usuario_id: string): Promise<Carteira | null> {
    const { rows } = await pool.query('SELECT * FROM carteiras WHERE user_id = $1', [usuario_id]);
    return rows[0];
  }

  async findByPrestadorId(prestador_id: string): Promise<Carteira | null> {

    const { rows } = await pool.query('SELECT * FROM carteiras WHERE prestador_id = $1', [prestador_id]);
    return rows[0];
 
  }

}
