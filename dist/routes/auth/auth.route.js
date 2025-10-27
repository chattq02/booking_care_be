"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = __importDefault(require("src/controllers/auth/register.controller"));
const auth_routes = (0, express_1.Router)();
auth_routes.use('/register', register_controller_1.default.registerController);
// auth_routes.use('/login')
exports.default = auth_routes;
