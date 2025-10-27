import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'src/schema.prisma',
  migrations: {
    path: 'src/migrations'
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL')
  }
})
