import { pool } from "./postgres";
import { createDatabaseIfNotExists } from "./createDatabase";
import fs from "fs";
import path from "path";

export async function runMigrations() {
  try {
    await createDatabaseIfNotExists();

    const files = [
      "./functions/gerarLogsAuditoria.sql",
      "./init.sql",
      "./triggers/audit.sql",
      "./procedures.sql",
    ];

    for (const file of files) {
      const sqlPath = path.join(__dirname, file);
      let sql = fs.readFileSync(sqlPath, "utf8");
      // Remove psql meta-commands (\i ...) que não funcionam via pool.query
      sql = sql.replace(/^\\i\s+.+$/gm, "");
      await pool.query(sql);
      console.log(`✅ Executado: ${file}`);
    }

    await pool.query(`
      ALTER TABLE IF EXISTS mensagens
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

      UPDATE mensagens
      SET created_at = NOW()
      WHERE created_at IS NULL;

      ALTER TABLE mensagens
      ALTER COLUMN created_at SET NOT NULL;
    `);

    await pool.query(`
      ALTER TABLE IF EXISTS usuarios
      ADD COLUMN IF NOT EXISTS telefone TEXT;
    `);

    // Seed das categorias base — idempotente (ON CONFLICT DO NOTHING)
    await pool.query(`
      INSERT INTO categorias (id, nome, slug, icon_url) VALUES
        ('cat1', 'Limpeza',             'limpeza',    NULL),
        ('cat2', 'Manutenção Elétrica', 'eletrica',   NULL),
        ('cat3', 'Encanador',           'encanador',  NULL),
        ('cat4', 'Aulas Particulares',  'aulas',      NULL),
        ('cat5', 'Beleza e Estética',   'beleza',     NULL),
        ('cat6', 'TI e Suporte',        'ti-suporte', NULL)
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Tabelas criadas/verificadas com sucesso!");
  } catch (err) {
    console.error("Erro ao rodar migrações:", err);
    process.exit(1);
  }
}

// Rodar direto via terminal: npm run db:setup
if (require.main === module) {
  runMigrations().then(() => process.exit());
}
