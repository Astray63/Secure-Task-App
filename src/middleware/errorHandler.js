import logger from '../utils/logger.js'

export default function errorHandler (err, req, res, next) { // eslint-disable-line
  logger.error(err.stack || err.message)
  const status = err.status || 500
  res.status(status).json({ error: status === 500 ? 'Erreur interne' : err.message })
}
