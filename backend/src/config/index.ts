import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const fusekiUrlFromEnv = process.env.FUSEKI_URL;

// This log is crucial for debugging. It confirms if your .env file is being read.
console.log(`[CONFIG] FUSEKI_URL from .env is: ${fusekiUrlFromEnv}`);

export const config = {
  // Use the environment variable if it exists, otherwise use a hardcoded default.
  // This removes the "undefined" error permanently.
  fusekiUrl: fusekiUrlFromEnv || 'http://localhost:3030/ds',
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-that-is-long',
};

// Add validation to catch configuration issues early
if (!config.fusekiUrl) {
  throw new Error('FUSEKI_URL is not defined in environment variables or config.ts');
}