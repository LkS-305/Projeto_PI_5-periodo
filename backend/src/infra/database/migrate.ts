import { pool } from './postgres';
import { createDatabaseIfNotExists } from './createDatabase';
import fs from 'fs';
import path from 'path';

export async function runMigrations() {
  try {
    await createDatabaseIfNotExists();

    const sqlPath = path.join(__dirname, './init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await pool.query(sql);
    console.log("🚀 Tabelas criadas/verificadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao rodar migrações:", err);
    process.exit(1);
  }
}

// Rodar direto via terminal: npm run db:setup
if (require.main === module) {
  runMigrations().then(() => process.exit());
}
