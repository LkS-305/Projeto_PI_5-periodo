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
      // Idempotente: garante tabela em bases antigas (também está no init.sql)
      "./add_verificacao_email_cadastro.sql",
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

    // Bases antigas: CREATE TABLE IF NOT EXISTS não acrescenta colunas novas.
    // Isto deve correr antes de migrações mais frágeis (ex.: mensagens).
    await pool.query(`
      ALTER TABLE IF EXISTS usuarios
      ADD COLUMN IF NOT EXISTS telefone TEXT;
    `);

    // Bases antigas: transações Asaas (populate / IniciarPagamento)
    await pool.query(`
      ALTER TABLE IF EXISTS transacoes
      ADD COLUMN IF NOT EXISTS asaas_payment_id TEXT;
    `);

    // Bases criadas com init antigo: avaliacoes.user_id → usuario_id (nome usado no repositório)
    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'avaliacoes' AND column_name = 'user_id'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'avaliacoes' AND column_name = 'usuario_id'
        ) THEN
          ALTER TABLE avaliacoes RENAME COLUMN user_id TO usuario_id;
        END IF;
      END $$;
    `);

    await pool.query(`
      ALTER TABLE IF EXISTS mensagens
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

      UPDATE mensagens
      SET created_at = NOW()
      WHERE created_at IS NULL;

      ALTER TABLE mensagens
      ALTER COLUMN created_at SET NOT NULL;
    `);

    // Seed das categorias base — idempotente (ON CONFLICT DO NOTHING)
    // icon_url: URLs placeholder (evita NOT NULL em bases onde a coluna foi criada obrigatória)
    await pool.query(`
      INSERT INTO categorias (id, nome, slug, icon_url) VALUES
        ('cat1', 'Limpeza',             'limpeza',    'https://placehold.co/100x100?text=Limpeza'),
        ('cat2', 'Manutenção Elétrica', 'eletrica',   'https://placehold.co/100x100?text=Eletrica'),
        ('cat3', 'Encanador',           'encanador',  'https://placehold.co/100x100?text=Encanador'),
        ('cat4', 'Aulas Particulares',  'aulas',      'https://placehold.co/100x100?text=Aulas'),
        ('cat5', 'Beleza e Estética',   'beleza',     'https://placehold.co/100x100?text=Beleza'),
        ('cat6', 'TI e Suporte',        'ti-suporte', 'https://placehold.co/100x100?text=TI')
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
