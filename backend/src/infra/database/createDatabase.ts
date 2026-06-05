import { Client } from 'pg';
import dotenv from 'dotenv';
import { logError, logInfo } from '../../core/utils/httpLogger';

dotenv.config();

export async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_DATABASE;

  if (!dbName) {
    throw new Error('DB_DATABASE não definido no .env');
  }

  // Conecta no banco padrão "postgres" para poder criar o banco do projeto
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    await client.connect();

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      logInfo('db.create_database', { created: true, database: dbName });
    } else {
      logInfo('db.create_database', { created: false, database: dbName });
    }
  } catch (err) {
    logError('db.create_database', err, { database: dbName });
    throw err;
  } finally {
    await client.end();
  }
}
