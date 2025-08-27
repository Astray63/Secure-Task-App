import Joi from 'joi'

export const createTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow('').max(2000)
  }),
  params: Joi.object({}),
  query: Joi.object({})
})

export const updateTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().allow('').max(2000).required(),
    completed: Joi.boolean().required()
  }),
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  query: Joi.object({})
})
