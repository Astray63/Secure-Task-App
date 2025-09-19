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
  console.log(`[DEBUG] updateTask appelé avec:`, { id, userId, title, description, completed })
  
  // Vérifier d'abord si la tâche existe et appartient à l'utilisateur
  const existing = await query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [id, userId])
  console.log(`[DEBUG] Tâche existante trouvée:`, existing.length > 0 ? 'OUI' : 'NON')
  
  if (existing.length === 0) {
    const error = new Error('Tâche non trouvée')
    error.status = 404
    throw error
  }
  
  // Mettre à jour seulement les champs fournis
  const updates = []
  const values = []
  
  if (title !== undefined) {
    updates.push('title = ?')
    values.push(title)
  }
  
  if (description !== undefined) {
    updates.push('description = ?')
    values.push(description)
  }
  
  if (completed !== undefined) {
    updates.push('completed = ?')
    values.push(completed ? 1 : 0)
  }
  
  if (updates.length === 0) {
    // Aucune mise à jour fournie, retourner la tâche actuelle
    const current = await query('SELECT id, title, description, completed, created_at FROM tasks WHERE id = ? AND user_id = ?', [id, userId])
    return current[0]
  }
  
  const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`
  values.push(id, userId)
  
  await query(sql, values)
  
  // Retourner la tâche mise à jour
  const updated = await query('SELECT id, title, description, completed, created_at FROM tasks WHERE id = ? AND user_id = ?', [id, userId])
  return updated[0]
}

export async function deleteTask ({ id, userId }) {
  // Vérifier si la tâche existe et appartient à l'utilisateur
  const existing = await query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [id, userId])
  if (existing.length === 0) {
    const error = new Error('Tâche non trouvée')
    error.status = 404
    throw error
  }
  
  await query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId])
}
