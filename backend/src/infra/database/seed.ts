import fs from "fs";
import path from "path";
import { pool } from "./postgres";
import { logError, logInfo } from "../../core/utils/httpLogger";
import { applySchemaPatches } from "./schemaPatches";

/**
 * Aplica populate.sql na base configurada no .env (mesmo host/user/database que a API).
 * Só deve correr com base vazia ou aceitando erros de duplicado (23505) se já houver dados.
 */
export async function runPopulate() {
  await applySchemaPatches();

  const sqlPath = path.join(__dirname, "populate.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  await pool.query(sql);
  logInfo("db.seed.done", { file: "populate.sql" });
}

if (require.main === module) {
  runPopulate()
    .then(() => process.exit(0))
    .catch((err) => {
      logError("db.seed.failed", err, {});
      console.error(err);
      process.exit(1);
    });
}
