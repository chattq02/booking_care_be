"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const use_routes_v1 = (0, express_1.Router)();
// use_routes_v1.use('/user', user_routes)
// use_routes_v1.use('/admin', admin_routes)
// use_routes_v1.use('/doctor', doctor_routes)
use_routes_v1.use('/auth', auth_route_1.default);
exports.default = use_routes_v1;
