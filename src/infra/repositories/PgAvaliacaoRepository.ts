import { IAvaliacaoRepository } from '../../core/repositories/IAvaliacaoRepository';
import { Avaliacao } from '../../core/entities/Avaliacao';
import { pool } from '../database/postgres';

import { AvaliarServicoRequest, AvaliarUPRequest, AvaliarPURequest } from '../../core/dtos/avaliacao';


export class PgAvaliacaoRepository implements IAvaliacaoRepository {
  async create(a: Avaliacao): Promise<Avaliacao>{
    const query = ``;
    const { rows } = await pool.query(query, [a.nota, a.comentario, a.servico_id]);
    return rows[0];
  }
  async listByServico(servico_id: string): Promise<Avaliacao[] | null>{
    const { rows } = await pool.query('SELECT nota, avaliacoes FROM  servicos WHERE id = $1', [servico_id]);
    return rows ?? null;
  }
  async listByPrestador(prestador_id: string): Promise<Avaliacao[] | null>{
    const { rows } = await pool.query('SELECT nota, avaliacoes FROM servicos WHERE id = $1', [prestador_id]);
    return rows ?? null;
  } 

   async listByUsuario(usuario_id: string): Promise<Avaliacao[] | null>{
    const { rows } = await pool.query('SELECT nota, avaliacoes FROM servicos WHERE id = $1', [usuario_id]);
    return rows ?? null;
  } 

  async avaliarUsuario(avaliarUPRquest: AvaliarUPRequest): Promise<boolean> {
    const { usuario_id, prestador_id, nota, comentario, media} = avaliarUPRquest;
    const destinatario = 'usuario';
    const resultado = await pool.query('INSERT INTO avaliacoes (id, usuario_id, prestador_id, nota, comentario, media, destinatario) VALUES (uuid, $1, $2, $3, $4, $5, 6$)', [usuario_id, prestador_id, nota, comentario, media, destinatario]);
    return (resultado?.rowCount ?? 0) > 0;

}
  async avaliarPrestador(avaliarPURequest: AvaliarPURequest): Promise<boolean> {
    const { prestador_id, usuario_id, nota, comentario, media } = avaliarPURequest;
    const destinatario = 'prestador';
    const resultado = await pool.query('INSERT INTO avaliacoes (id, prestador_id, usuario_id, nota, comentario, media, destinatario) VALUES (uuid, $1, $2, $3, $4, $5, $6)', [prestador_id, usuario_id, nota, media, comentario, destinatario]);
    
    return (resultado?.rowCount ?? 0) > 0;
  }
  async avaliarServico(avaliarServicoRequest: AvaliarServicoRequest): Promise<boolean> {
    const { servico_id, nota, usuario_id, prestador_id, comentario, media } = avaliarServicoRequest;
    const destinatario = 'servico';
    const resultado = await pool.query('INSERT INTO avaliacoes (id, servico_id, usuario_id, prestador_id, nota, comentario, media, destinatario) VALUES (uuid, $1, $2, $3, $4, $5, $6, $7)', [servico_id, prestador_id, usuario_id, nota, media, comentario, destinatario]);
    
    return (resultado?.rowCount ?? 0) > 0;
  }

}



