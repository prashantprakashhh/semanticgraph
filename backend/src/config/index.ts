// import dotenv from 'dotenv';
// dotenv.config();

// const fusekiUrlFromEnv = process.env.FUSEKI_URL;
// console.log(`[CONFIG] FUSEKI_URL from .env is: ${fusekiUrlFromEnv}`);

// export const config = {
//   port: process.env.PORT || 3001,
//   jwtSecret: process.env.JWT_SECRET || 'devileye',
//   fusekiUrl: fusekiUrlFromEnv || 'http://localhost:3030/ds',
// };

export const config = {
  fusekiUrl: process.env.FUSEKI_URL || 'http://localhost:3030/ds',
  port: process.env.PORT || 3001,
};

// Add validation to catch configuration issues early
if (!config.fusekiUrl) {
  throw new Error('FUSEKI_URL is not defined in environment variables');
}

console.log('[CONFIG] Using FUSEKI_URL:', config.fusekiUrl);