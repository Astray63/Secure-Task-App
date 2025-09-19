import { createTask, listTasks, updateTask, deleteTask } from '../models/Task.js'

export async function createTaskCtrl (req, res, next) {
  try {
    const { title, description } = req.body
    const task = await createTask({ userId: req.user.id, title, description })
    res.status(201).json(task)
  } catch (err) { next(err) }
}

export async function listTasksCtrl (req, res, next) {
  try {
    const tasks = await listTasks(req.user.id)
    res.json(tasks)
  } catch (err) { next(err) }
}

export async function updateTaskCtrl (req, res, next) {
  try {
    const id = parseInt(req.params.id)
    const { title, description, completed } = req.body
    console.log(`[DEBUG] Tentative de mise à jour de la tâche ${id} pour l'utilisateur ${req.user.id}`)
    console.log(`[DEBUG] Données reçues:`, { title, description, completed })
    const task = await updateTask({ id, userId: req.user.id, title, description, completed })
    console.log(`[DEBUG] Tâche mise à jour:`, task)
    res.json(task)
  } catch (err) { 
    console.log(`[DEBUG] Erreur lors de la mise à jour:`, err.message)
    next(err) 
  }
}

export async function deleteTaskCtrl (req, res, next) {
  try {
    const id = parseInt(req.params.id)
    await deleteTask({ id, userId: req.user.id })
    res.status(204).send()
  } catch (err) { next(err) }
}
