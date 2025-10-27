"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_routes = (0, express_1.Router)();
admin_routes.use('/admin');
exports.default = admin_routes;
