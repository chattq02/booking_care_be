"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMiddlewares = registerMiddlewares;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_middleware_1 = require("../middlewares/cors.middleware");
const error_middlewares_1 = require("src/middlewares/error.middlewares");
const swagger_config_1 = require("src/config/swagger.config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function registerMiddlewares(app) {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(cors_middleware_1.corsMiddleware);
    app.use((0, cors_1.default)());
    // Đăng ký route chính
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
    // 5️⃣ Routes
    // registerRoutes(app);
    // 6️⃣ Health Check
    app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));
    app.use(error_middlewares_1.errorMiddleware);
}
