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
    title: Joi.string().min(1).max(255),
    description: Joi.string().allow('').max(2000),
    completed: Joi.boolean()
  }).or('title', 'description', 'completed'),
  params: Joi.object({
    id: Joi.string().pattern(/^\d+$/).required()
  }),
  query: Joi.object({})
})

export const deleteTaskSchema = Joi.object({
  body: Joi.object({}),
  params: Joi.object({
    id: Joi.string().pattern(/^\d+$/).required()
  }),
  query: Joi.object({})
})
