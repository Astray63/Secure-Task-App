import mysql from 'mysql2/promise'
import logger from '../utils/logger.js'
import { loadEnv } from './env.js'

loadEnv()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_app',
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? Number(process.env.DB_CONNECTION_LIMIT) : 10,
  timezone: 'Z'
})

export async function testDatabaseConnection () {
  const conn = await pool.getConnection()
  await conn.ping()
  conn.release()
  logger.info('Connexion MySQL OK')
}

export async function query (sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export default pool
