import cors, { CorsOptions } from 'cors'
import { RequestHandler } from 'express'

// ✅ Danh sách domain được phép truy cập API
const allowedOrigins = [
  'http://localhost:3000', // dev frontend
  'http://localhost:4000'
]

// ✅ Cấu hình CORS nâng cao
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Cho phép Postman / server-side (origin = undefined)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  },
  credentials: true, // Cho phép gửi cookie / token
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Knowledge-Token'],
  optionsSuccessStatus: 204 // Trả về cho preflight request
}

// ✅ Export middleware dùng trong Express
export const corsMiddleware: RequestHandler = cors(corsOptions)
