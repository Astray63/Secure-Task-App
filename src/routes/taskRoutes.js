import { Router } from 'express'
import auth from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { createTaskSchema, updateTaskSchema } from '../validation/taskValidation.js'
import { createTaskCtrl, listTasksCtrl, updateTaskCtrl, deleteTaskCtrl } from '../controllers/taskController.js'

const router = Router()

router.use(auth)

router.get('/', listTasksCtrl)
router.post('/', validate(createTaskSchema), createTaskCtrl)
router.put('/:id', validate(updateTaskSchema), updateTaskCtrl)
router.delete('/:id', deleteTaskCtrl)

export default router
