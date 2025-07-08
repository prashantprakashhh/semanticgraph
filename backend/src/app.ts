// import express from 'express';
// import cors from 'cors';
// import authRoutes from './routes/auth';
// import ingestRoutes from './routes/ingest';
// import graphRoutes from './routes/graph';
// import { protect } from './middleware/auth';

// const app = express();

// app.use(cors());
// app.use(express.json());

// // Public route for authentication
// app.use('/api/auth', authRoutes);

// // Protected routes that require a valid JWT
// app.use('/api/ingest', protect, ingestRoutes);
// app.use('/api/graph', protect, graphRoutes);

// export default app;

// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import ingestRoutes from './routes/ingest';
import graphRoutes from './routes/graph';
import { protect } from './middleware/auth';
import { config } from './config'; // Import config for the clear route

const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Public route for authentication
app.use('/api/auth', authRoutes);

// Protected routes that require a valid JWT
app.use('/api/ingest', protect, ingestRoutes);
app.use('/api/graph', protect, graphRoutes);

// ** NEW PUBLIC DEBUG ROUTE TO CLEAR THE DATABASE **
app.delete('/api/clear-db', async (req, res) => {
    console.log('[ADMIN] Request to clear database received.');
    const sparqlUpdate = 'CLEAR DEFAULT'; // Command to clear the default graph

    try {
        const response = await fetch(`${config.databaseUrl}/statements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `update=${encodeURIComponent(sparqlUpdate)}`
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Clear operation failed with status: ${response.status} - ${errorBody}`);
        }
        
        console.log('[ADMIN] Database cleared successfully.');
        res.status(200).json({ message: 'Database cleared successfully.' });

    } catch (error: any) {
        console.error('[ADMIN] Failed to clear database:', error);
        res.status(500).json({ message: 'Failed to clear database', error: error.message });
    }
});


export default app;