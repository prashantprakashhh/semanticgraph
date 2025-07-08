// Import config first to ensure environment variables are loaded immediately.
import { config } from './config'; 
import app from './app';

app.listen(config.port, () => {
  console.log(`Backend server running on http://localhost:${config.port}`);
  console.log(`[SERVER] Fuseki URL is configured to: ${config.fusekiUrl}`);
});