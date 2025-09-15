// usage: module-scope sql client, validate postId, explicit columns, error handling
import { neon } from '@netlify/neon';
const sql = neon(); // module-scope: réutilisable entre invocations (serverless friendly)

export async function getPostById(postId) {
  // validation / casting
  const id = Number(postId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error('Invalid post id');
  }

  try {
    // explicit columns, LIMIT 1
    const rows = await sql`
      SELECT id, title, content, author_id, created_at, updated_at
      FROM posts
      WHERE id = ${id}
      LIMIT 1
    `;
    const post = rows[0] ?? null;
    return post;
  } catch (err) {
    // logging utile en prod (structure logs)
    console.error('DB error getPostById', err);
    throw err;
  }
}
