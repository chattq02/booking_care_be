"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
const run_1 = require("./initialize/run");
const logger_config_1 = require("./config/logger.config");
const database_config_1 = require("./config/database.config");
(0, dotenv_1.config)(); // Load biến môi trường
const PORT = process.env.PORT || 3000;
const logger = (0, logger_config_1.createLogger)('Main');
async function bootstrap() {
    const app = (0, express_1.default)();
    try {
        // 1️⃣ Kết nối Database
        await (0, database_config_1.connectDb)();
        // 2️⃣ Load Middleware & Routes
        (0, run_1.registerMiddlewares)(app);
        // 3️⃣ Tạo HTTP server
        const server = http_1.default.createServer(app);
        // 4️⃣ Lắng nghe port
        server.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
        });
        // 5️⃣ Graceful shutdown
        const shutdown = async () => {
            logger.info('🛑 Shutting down gracefully...');
            await database_config_1.prisma.$disconnect();
            server.close(() => {
                logger.info('✅ Server closed');
                process.exit(0);
            });
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }
    catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
bootstrap();
