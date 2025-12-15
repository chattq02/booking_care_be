import cors, { CorsOptions } from 'cors'
import { RequestHandler } from 'express'

// ✅ Danh sách domain được phép truy cập
const allowedOrigins = [
  'http://doctor.localhost:5100',
  'http://localhost:4530',
  'http://user.localhost:5100',
  'http://admin.localhost:5100',
  'http://localhost:5100'
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
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Timezone',
    'X-Language',
    'X-Client-Type',
    'X-Current-Url'
  ],
  exposedHeaders: ['Content-Length', 'X-Knowledge-Token'],
  optionsSuccessStatus: 204
}

// ✅ Export middleware
export const corsMiddleware: RequestHandler = cors(corsOptions)
