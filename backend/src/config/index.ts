import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'devileye',
  // Use the new GraphDB URL
  databaseUrl: process.env.GRAPHDB_URL || 'http://localhost:7200/repositories/semantic-graph',
};

if (!config.databaseUrl) {
  throw new Error('Database URL is not defined in environment variables or config.ts');
}