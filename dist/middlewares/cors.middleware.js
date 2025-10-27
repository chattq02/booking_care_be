"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
// ✅ Danh sách domain được phép truy cập API
const allowedOrigins = [
    'http://localhost:3000', // dev frontend
    'http://127.0.0.1:3000',
    'https://your-production-domain.com' // thêm domain production ở đây
];
// ✅ Cấu hình CORS nâng cao
const corsOptions = {
    origin: (origin, callback) => {
        // Cho phép Postman / server-side (origin = undefined)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true, // Cho phép gửi cookie / token
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Knowledge-Token'],
    optionsSuccessStatus: 204 // Trả về cho preflight request
};
// ✅ Export middleware dùng trong Express
exports.corsMiddleware = (0, cors_1.default)(corsOptions);
