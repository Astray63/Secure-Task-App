import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimiter from './middleware/rateLimiter.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import { loadEnv } from './config/env.js'

loadEnv()
const app = express()

// Configuration de la sécurité avec Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}))
// Configuration CORS et middlewares
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }))
app.use(express.json({ limit: '10kb' }))
app.use(morgan('dev'))
app.use(rateLimiter)

// Configuration du serveur de fichiers statiques
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, '..', 'public')))

// Route de vérification de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes API
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Gestionnaire de routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// Gestionnaire d'erreurs global
app.use(errorHandler)

export default app
