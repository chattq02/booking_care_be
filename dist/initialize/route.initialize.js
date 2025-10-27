"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesInit = routesInit;
const swagger_config_1 = require("src/config/swagger.config");
const use_routes_v1_1 = __importDefault(require("src/routes/use-routes-v1"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function routesInit(app) {
    // Đăng ký route chính
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
    app.use('/v1', use_routes_v1_1.default);
    app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));
}
