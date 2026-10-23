
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import employeeRoutes from './routes/employees.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);

app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/employees', employeeRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

const server = app.listen(PORT, () => {
  console.log(`Employee Directory API running at http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    pool.end()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error('Error closing database pool:', error);
    process.exit(1);
  });
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
