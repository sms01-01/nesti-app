import { neon } from '@netlify/neon';

// Cette fonction sera utilisée pour exécuter des requêtes SQL
export const sql = neon(process.env.NETLIFY_DATABASE_URL);
