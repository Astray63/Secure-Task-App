// Modèle User - accès via requêtes paramétrées pour limiter l'injection SQL
import { query } from '../config/database.js'

export async function createUser ({ email, passwordHash }) {
  const sql = 'INSERT INTO users (email, password_hash) VALUES (?, ?)'
  const result = await query(sql, [email.toLowerCase(), passwordHash])
  return { id: result.insertId, email }
}

export async function findUserByEmail (email) {
  const rows = await query('SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()])
  return rows[0]
}

export async function findUserById (id) {
  const rows = await query('SELECT id, email FROM users WHERE id = ? LIMIT 1', [id])
  return rows[0]
}
