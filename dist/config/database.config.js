"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.connectDb = connectDb;
const client_1 = require("src/generated/prisma/client");
const logger_config_1 = require("./logger.config");
const logger = (0, logger_config_1.createLogger)('Database');
// Build cấu hình không qua URL
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    },
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' }
    ]
});
async function connectDb() {
    try {
        await exports.prisma.$connect();
        logger.info('✅ Connected to PostgreSQL');
    }
    catch (err) {
        logger.error('❌ Database connection failed:', err);
        process.exit(1);
    }
}
