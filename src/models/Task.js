import { query } from '../config/database.js'

export async function createTask ({ userId, title, description = '' }) {
  const sql = 'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)'
  const result = await query(sql, [userId, title, description])
  return { id: result.insertId, userId, title, description, completed: 0 }
}

export async function listTasks (userId) {
  return await query('SELECT id, title, description, completed, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId])
}

export async function updateTask ({ id, userId, title, description, completed }) {
  const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?'
  await query(sql, [title, description, completed ? 1 : 0, id, userId])
  return { id, userId, title, description, completed: completed ? 1 : 0 }
}

export async function deleteTask ({ id, userId }) {
  await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId])
}
