import { sql } from './db.js';

export default async (req, context) => {
  try {
    const familyMembers = await sql`
      SELECT * FROM family_members ORDER BY created_at DESC
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify(familyMembers)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

export const config = {
  path: '/api/get-family'
};
