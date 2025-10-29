import cors, { CorsOptions } from 'cors'
import { RequestHandler } from 'express'

// ✅ Danh sách domain được phép truy cập
const allowedOrigins = [
  'http://doctor.localhost:5173',
  'http://localhost:4000',
  'http://user.localhost:5173',
  'http://admin.localhost:5173'
]

// ✅ Cấu hình CORS
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // Postman, server-side
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  },
  credentials: true, // cho phép gửi cookie
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Timezone', 'X-Language'],
  exposedHeaders: ['Content-Length', 'X-Knowledge-Token'],
  optionsSuccessStatus: 204
}

// ✅ Export middleware
export const corsMiddleware: RequestHandler = cors(corsOptions)
