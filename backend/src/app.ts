// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import ingestRoutes from './routes/ingest';
import graphRoutes from './routes/graph';
import { protect } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ingest', protect, ingestRoutes);
app.use('/api/graph', protect, graphRoutes);

export default app;