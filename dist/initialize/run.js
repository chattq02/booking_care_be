"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMiddlewares = registerMiddlewares;
const express_1 = __importDefault(require("express"));
const error_middlewares_1 = require("src/middlewares/error.middlewares");
const cors_middleware_1 = require("src/middlewares/cors.middleware");
function registerMiddlewares(app) {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(cors_middleware_1.corsMiddleware);
    app.use(error_middlewares_1.errorMiddleware);
}
