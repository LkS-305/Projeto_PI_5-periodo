import express from 'express';
import cors from 'cors';
import { pool } from '../database/postgres';
import { userRouter } from '../routes/user.routes';
import { avaliacaoRouter } from '../routes/avaliacao.router'

const app = express();


app.use(cors());
app.use(express.json());



app.use((req, res, next) => {
	console.log('[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}');
	next();
});

app.use('/users', userRouter);
app.use('/avaliacao', avaliacaoRouter);

app.get('/health', async (req, res) => {
	try {
		const result = await pool.query('SELECT NOW()');
		res.json({
			status: 'online',
			db_connection: true,
			db_time: result.rows[0].now
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			db_connection: false,
			message: err instanceof Error ? err.message : 'Unknown error'
		});
	}
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`\n Server iniciado com sucesso!`);
	console.log(`\Endpoint de teste: /health`);
});
