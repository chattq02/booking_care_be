"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'My API Documentation',
            version: '1.0.0',
            description: 'REST API built with Express + Sequelize + TypeScript',
            contact: {
                name: 'Your Team Name',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: process.env.API_BASE_URL || 'http://localhost:6000/api',
                description: 'Development server'
            }
        ]
    },
    // Nơi Swagger tìm kiếm file định nghĩa API
    apis: ['./src/routes/**/*.ts', './src/modules/**/*.route.ts', './src/modules/**/*.controller.ts']
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
