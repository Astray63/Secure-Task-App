import { createServer } from 'http'
import app from './app.js'
import { loadEnv } from './config/env.js'
import { testDatabaseConnection } from './config/database.js'
import logger from './utils/logger.js'

loadEnv()
const PORT = process.env.PORT || 3000

async function start () {
  try {
    await testDatabaseConnection()
  } catch (err) {
    logger.warn('La connexion à la base a échoué au démarrage (continuation quand même): ' + err.message)
  }
  const server = createServer(app)
  server.listen(PORT, () => {
    logger.info(`Serveur démarré sur http://localhost:${PORT}`)
  })
}

start()
