import dotenv from 'dotenv'
let loaded = false
export function loadEnv () {
  if (loaded) return
  // 1) Charger .env (par défaut)
  const base = dotenv.config()
  if (base.error) {
    // Pas de .env trouvé, ce n'est pas bloquant en CI ou conteneur si variables déjà fournies
  }
  // 2) Charger .env.local (si présent) pour surcharger en dev local
  //    Utile quand on fait tourner l'API en local mais la DB dans Docker (port 3307)
  dotenv.config({ path: '.env.local', override: true })
  loaded = true
}

export function required (key) {
  const val = process.env[key]
  if (!val) throw new Error(`Variable d'environnement manquante: ${key}`)
  return val
}
