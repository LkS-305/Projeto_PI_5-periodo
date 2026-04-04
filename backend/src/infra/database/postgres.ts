import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração baseada no seu Docker
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Log para confirmar que o banco está vivo
pool.on('connect', () => {
  console.log('🐘 Postgres: Conexão estabelecida com sucesso!');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool do Postgres:', err);
});
