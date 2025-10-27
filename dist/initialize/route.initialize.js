"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesInit = routesInit;
const use_routes_v1_1 = __importDefault(require("src/routes/use-routes-v1"));
function routesInit(app) {
    // Đăng ký route chính
    // app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.use('/v1', use_routes_v1_1.default);
    app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));
}
