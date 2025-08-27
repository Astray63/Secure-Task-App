export default function validate (schema) {
  return (req, res, next) => {
    const data = { body: req.body, params: req.params, query: req.query }
    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true })
    if (error) {
      return res.status(400).json({ error: 'Validation échouée', details: error.details.map(d => d.message) })
    }
    next()
  }
}
