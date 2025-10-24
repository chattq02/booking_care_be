import { Sequelize } from 'sequelize-typescript'
import * as path from 'path'
import * as fs from 'fs'
import * as pg from 'pg'

require('dotenv').config()

export const connectDbSequelize = new Sequelize({
  database: process.env.DB_NAME_DATABASE as string,
  dialect: 'postgres',
  protocol: 'postgres',
  dialectModule: pg,
  logging: false, // Tắt toàn bộ logging
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [path.join(__dirname, '..', 'models')], // Thay đổi đường dẫn tới thư mục models
  pool: {
    max: 1000, // Số kết nối tối đa trong pool
    min: 0, // Số kết nối tối thiểu trong pool
    acquire: 30000, // Thời gian tối đa (ms) để cố gắng lấy một kết nối trước khi throw error
    idle: 10000 // Thời gian tối đa (ms) mà một kết nối có thể ở trạng thái nhàn rỗi trước khi bị đóng
  }
  // dialectOptions: {
  //   ssl: {
  //     require: true, // Enforces SSL connection
  //     rejectUnauthorized: false // Allows self-signed certificates (optional, for local testing)
  //   }
  // }
})

// Load all models from the models directory
const modelsDir = path.join(__dirname, '..', 'models')
fs.readdirSync(modelsDir)
  .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.ts') //// Lọc các tệp .ts
  .forEach((file) => {
    const model = require(path.join(modelsDir, file)).default
    connectDbSequelize.addModels([model])
  })
