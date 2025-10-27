"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes = (0, express_1.Router)();
user_routes.use('/users');
exports.default = user_routes;
