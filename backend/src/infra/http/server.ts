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
import { categoriaRouter } from "../routes/categoria.routes";
import { servicoRouter } from "../routes/servico.routes";
import { enderecoRouter } from "../routes/endereco.routes";
import { documentoRouter } from "../routes/documento.routes";
import { carteiraRouter } from "../routes/carteira.routes";
import { mensagemRouter } from "../routes/mensagem.routes";
import { transacaoRouter } from "../routes/transacao.routes";
import { portfolioRouter } from "../routes/portfolio.routes";
import { exploreRouter } from "../routes/explore.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(logFullCycle);
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

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "online",
      db_connection: true,
      db_time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      db_connection: false,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`\n Server iniciado na porta ${PORT}!`);
  console.log(`\n Endpoint de teste: /health`);
});
