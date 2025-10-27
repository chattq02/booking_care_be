"use strict";
/**
 * Prisma Migration Runner - Compatible with Prisma v5+
 * -----------------------------------------------------
 * ✅ Không cần DATABASE_URL trong .env
 * ✅ Không dùng --url (bị bỏ)
 * ✅ Set DATABASE_URL động tại runtime
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv.config();
// ====== Load DB connection info ======
const { NODE_ENV = 'development' } = process.env;
// ====== Đường dẫn schema ======
const rootDir = process.cwd();
const schemaPath = fs_1.default.existsSync(path_1.default.join(rootDir, 'src/schema.prisma'))
    ? path_1.default.join(rootDir, 'src/schema.prisma')
    : path_1.default.resolve(__dirname, '../../src/schema.prisma');
// ====== Helper ======
function log(msg, type = 'info') {
    const colors = {
        info: '\x1b[36m%s\x1b[0m',
        success: '\x1b[32m%s\x1b[0m',
        error: '\x1b[31m%s\x1b[0m'
    };
    console.log(colors[type], msg);
}
function detectMigrationName() {
    return 'auto';
}
// ====== Run Migration ======
async function runMigration() {
    const argName = process.argv[2];
    const migrationName = argName || detectMigrationName();
    const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL };
    const command = NODE_ENV === 'production'
        ? `npx prisma migrate deploy --schema=${schemaPath}`
        : `npx prisma migrate dev --name ${migrationName} --schema=${schemaPath}`;
    log(`🏋️  Running Prisma migration [${NODE_ENV}]...`, 'info');
    (0, child_process_1.execSync)(command, { stdio: 'inherit', env });
    log('✅ Migration complete!', 'success');
    log('⚙️ Generating Prisma Client...', 'info');
    (0, child_process_1.execSync)(`npx prisma generate --schema=${schemaPath}`, { stdio: 'inherit', env });
    log('✅ Prisma Client generated successfully!', 'success');
}
runMigration().catch((err) => {
    log(`❌ Migration failed: ${err.message}`, 'error');
    process.exit(1);
});
