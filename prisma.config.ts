import 'dotenv/config'
import path from 'node:path'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: path.join('src'),
  migrations: {
    path: 'src/migrations'
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL')
  }
})
