// backend/src/server.ts

// Import config first to ensure environment variables are loaded immediately.
import { config } from './config'; 
import app from './app';

app.listen(config.port, () => {
  console.log(`Backend server running on http://localhost:${config.port}`);
  // Correctly log the database URL being used
  console.log(`[SERVER] Database URL is configured to: ${config.databaseUrl}`);
});