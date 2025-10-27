import fs from 'fs'
import path from 'path'

const baseSchema = `generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`

const modelsDir = path.join(__dirname, '../models')
const outputPath = path.join(__dirname, '../schema.prisma')

// ⚙️ Chỉ lấy các file .prisma trong models/, bỏ qua schema.prisma cũ
const files = fs.readdirSync(modelsDir).filter((f) => f.endsWith('.prisma') && f !== 'schema.prisma')

// ⚙️ Đọc nội dung model
const models = files.map((f) => fs.readFileSync(path.join(modelsDir, f), 'utf-8').trim()).join('\n\n')

// ⚙️ Ghi lại file schema mới
fs.writeFileSync(outputPath, baseSchema + '\n\n' + models + '\n')

console.log(`✅ schema.prisma merged successfully at: ${outputPath}`)
