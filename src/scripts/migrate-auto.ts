/**
 * Prisma Migration Runner - Compatible with Prisma v5+
 * -----------------------------------------------------
 * ✅ Không cần DATABASE_URL trong .env
 * ✅ Không dùng --url (bị bỏ)
 * ✅ Set DATABASE_URL động tại runtime
 */

import { execSync } from 'child_process'
import * as dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { DataBaseUrl } from 'src/config/database.config'

dotenv.config()

// ====== Load DB connection info ======
const { NODE_ENV = 'development' } = process.env

// ====== Đường dẫn schema ======
const rootDir = process.cwd()
const schemaPath = fs.existsSync(path.join(rootDir, 'src/schema.prisma'))
  ? path.join(rootDir, 'src/schema.prisma')
  : path.resolve(__dirname, '../../src/schema.prisma')

// ====== Helper ======
function log(msg: string, type: 'info' | 'success' | 'error' = 'info') {
  const colors = {
    info: '\x1b[36m%s\x1b[0m',
    success: '\x1b[32m%s\x1b[0m',
    error: '\x1b[31m%s\x1b[0m'
  }
  console.log(colors[type], msg)
}

function detectMigrationName(): string {
  return 'auto'
}

// ====== Run Migration ======
async function runMigration() {
  const argName = process.argv[2]
  const migrationName = argName || detectMigrationName()
  const env = { ...process.env, DATABASE_URL: DataBaseUrl }

  const command =
    NODE_ENV === 'production'
      ? `npx prisma migrate deploy --schema=${schemaPath}`
      : `npx prisma migrate dev --name ${migrationName} --schema=${schemaPath}`

  log(`🏋️  Running Prisma migration [${NODE_ENV}]...`, 'info')

  execSync(command, { stdio: 'inherit', env })

  log('✅ Migration complete!', 'success')

  log('⚙️ Generating Prisma Client...', 'info')
  execSync(`npx prisma generate --schema=${schemaPath}`, { stdio: 'inherit', env })
  log('✅ Prisma Client generated successfully!', 'success')
}

runMigration().catch((err) => {
  log(`❌ Migration failed: ${err.message}`, 'error')
  process.exit(1)
})
