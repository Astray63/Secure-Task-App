import dotenv from 'dotenv'
let loaded = false
export function loadEnv () {
  if (loaded) return
  const result = dotenv.config()
  if (result.error) {
    // Pas de .env trouvé, ce n'est pas bloquant en CI ou conteneur si variables déjà fournies
  }
  loaded = true
}

export function required (key) {
  const val = process.env[key]
  if (!val) throw new Error(`Variable d'environnement manquante: ${key}`)
  return val
}
