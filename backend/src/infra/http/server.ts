import express from "express";
import cors from "cors";
import path from "path";
import { pool } from "../database/postgres";
import { userRouter } from "../routes/user.routes";
import { usuarioRouter } from "../routes/usuario.routes";
import { prestadorRouter } from "../routes/prestador.routes";
import { avaliacaoRouter } from "../routes/avaliacao.routes";
import { errorHandler } from "../../middlewares/ErrorHandler";
import { logFullCycle } from "../../middlewares/Logger";
import { globalRateLimit } from "../../middlewares/RateLimit";
import { internalRouter } from "../routes/internal.routes";
import { categoriaRouter } from "../routes/categoria.routes";
import { servicoRouter } from "../routes/servico.routes";
import { enderecoRouter } from "../routes/endereco.routes";
import { documentoRouter } from "../routes/documento.routes";
import { carteiraRouter } from "../routes/carteira.routes";
import { mensagemRouter } from "../routes/mensagem.routes";
import { transacaoRouter } from "../routes/transacao.routes";
import { portfolioRouter } from "../routes/portfolio.routes";
import { exploreRouter } from "../routes/explore.routes";
import { logInfo } from "../../core/utils/httpLogger";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(logFullCycle);
/** Métricas / SSE: antes do rate limit para não penalizar dashboards longos */
app.use("/internal", internalRouter);
app.use(globalRateLimit);

app.use("/user", userRouter);
app.use("/usuario", usuarioRouter);
app.use("/prestador", prestadorRouter);
app.use("/avaliacao", avaliacaoRouter);
app.use("/categoria", categoriaRouter);
app.use("/servico", servicoRouter);
app.use("/endereco", enderecoRouter); // SCRUM-25/27: gestão de endereços
app.use("/documento", documentoRouter); // SCRUM-23/43: documentos e verificação
app.use("/carteira", carteiraRouter); // SCRUM-42: carteira do usuário
app.use("/mensagem", mensagemRouter);
app.use("/transacao", transacaoRouter);
app.use("/portfolio", portfolioRouter);
app.use("/explore", exploreRouter);

function errnoFromDbError(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const e = err as NodeJS.ErrnoException & { errors?: NodeJS.ErrnoException[] };
  if (typeof e.code === "string") return e.code;
  const first = e.errors?.[0];
  if (first && typeof first.code === "string") return first.code;
  return undefined;
}

function healthDbFailureMessage(err: unknown): string {
  const code = errnoFromDbError(err);
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  if (code === "ECONNREFUSED") {
    return `Ligação recusada em ${host}:${port}. Não há PostgreSQL a escutar aí — sobe o container (na pasta backend: docker compose up -d) ou corrige DB_HOST/DB_PORT no .env.`;
  }
  if (code === "28P01") {
    return "Autenticação PostgreSQL falhou (utilizador ou senha). Confirma DB_USER e DB_PASSWORD no .env.";
  }
  if (code === "3D000") {
    const db = process.env.DB_DATABASE || "projeto_pi";
    return `A base "${db}" não existe neste PostgreSQL. Cria-a (pgAdmin / psql: CREATE DATABASE "${db}";) ou corre as migrações do projeto, ou altera DB_DATABASE no .env para uma base que já exista (ex.: postgres).`;
  }
  return err instanceof Error ? err.message : "Unknown error";
}

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "online",
      db_connection: true,
      db_time: result.rows[0].now,
    });
  } catch (err) {
    const code = errnoFromDbError(err);
    res.status(500).json({
      status: "error",
      db_connection: false,
      ...(code ? { code } : {}),
      message: healthDbFailureMessage(err),
    });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  logInfo("http.server.listen", {
    port: PORT,
    healthPath: "/health",
    metricsPath: "/internal/metrics",
    metricsStreamPath: "/internal/metrics/stream",
  });
});
