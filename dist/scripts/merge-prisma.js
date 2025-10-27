"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const baseSchema = `generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;
const modelsDir = path_1.default.join(__dirname, '../models');
const outputPath = path_1.default.join(__dirname, '../schema.prisma');
// ⚙️ Chỉ lấy các file .prisma trong models/, bỏ qua schema.prisma cũ
const files = fs_1.default.readdirSync(modelsDir).filter((f) => f.endsWith('.prisma') && f !== 'schema.prisma');
// ⚙️ Đọc nội dung model
const models = files.map((f) => fs_1.default.readFileSync(path_1.default.join(modelsDir, f), 'utf-8').trim()).join('\n\n');
// ⚙️ Ghi lại file schema mới
fs_1.default.writeFileSync(outputPath, baseSchema + '\n\n' + models + '\n');
console.log(`✅ schema.prisma merged successfully at: ${outputPath}`);
