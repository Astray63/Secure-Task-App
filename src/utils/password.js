import bcrypt from 'bcryptjs'

export async function hashPassword (plain) {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12)
  return await bcrypt.hash(plain, rounds)
}

export async function verifyPassword (plain, hash) {
  return await bcrypt.compare(plain, hash)
}
