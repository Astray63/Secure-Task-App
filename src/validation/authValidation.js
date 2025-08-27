import Joi from 'joi'

export const registerSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(64).pattern(/[A-Z]/).pattern(/[0-9]/).required()
      .messages({
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule et un chiffre.'
      })
  }),
  params: Joi.object({}),
  query: Joi.object({})
})

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  params: Joi.object({}),
  query: Joi.object({})
})
