import { sql } from './db.js';

export default async (req, context) => {
  if (req.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const familyData = JSON.parse(req.body);
    
    // Créer la table si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS family_members (
        id SERIAL PRIMARY KEY,
        prenom VARCHAR(100) NOT NULL,
        nom VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        avatar VARCHAR(10) NOT NULL,
        mineur BOOLEAN DEFAULT FALSE,
        gps TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Insérer les données
    const result = await sql`
      INSERT INTO family_members (prenom, nom, role, avatar, mineur, gps)
      VALUES (${familyData.prenom}, ${familyData.nom}, ${familyData.role}, 
              ${familyData.avatar}, ${familyData.mineur}, ${familyData.gps})
      RETURNING *
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify(result[0])
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const config = {
  path: '/api/save-family'
};
