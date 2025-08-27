import jwt from 'jsonwebtoken'
import { findUserById } from '../models/User.js'

export default async function auth (req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null
    if (!token) return res.status(401).json({ error: 'Token manquant' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await findUserById(payload.sub)
    if (!user) return res.status(401).json({ error: 'Utilisateur inexistant' })
    req.user = { id: user.id, email: user.email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Authentification invalide' })
  }
}
