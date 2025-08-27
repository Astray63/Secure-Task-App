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
    const { id } = req.params
    const { title, description, completed } = req.body
    const task = await updateTask({ id, userId: req.user.id, title, description, completed })
    res.json(task)
  } catch (err) { next(err) }
}

export async function deleteTaskCtrl (req, res, next) {
  try {
    const { id } = req.params
    await deleteTask({ id, userId: req.user.id })
    res.status(204).send()
  } catch (err) { next(err) }
}
