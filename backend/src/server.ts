// backend/src/app.ts or server.ts
import dotenv from 'dotenv';

// Load environment variables BEFORE importing other modules
dotenv.config();

import express from 'express';
import cors from 'cors';
import { config } from './config';
import ingestRouter from './routes/ingest';
import graphRouter from './routes/graph';
import authRouter from './routes/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/ingest', ingestRouter);
app.use('/api/graph', graphRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    fusekiUrl: config.fusekiUrl,
    timestamp: new Date().toISOString()
  });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Using Fuseki URL: ${config.fusekiUrl}`);
});

export default app;