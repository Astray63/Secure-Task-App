import jwt from 'jsonwebtoken'
import { createUser, findUserByEmail } from '../models/User.js'
import { hashPassword, verifyPassword } from '../utils/password.js'

export async function register (req, res, next) {
  try {
    const { email, password } = req.body
    const existing = await findUserByEmail(email)
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' })
    const passwordHash = await hashPassword(password)
    const user = await createUser({ email, passwordHash })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (err) { next(err) }
}

export async function login (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' })
    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Identifiants invalides' })
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' })
    res.json({ token })
  } catch (err) { next(err) }
}
