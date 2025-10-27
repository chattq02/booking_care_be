"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctor_routes = (0, express_1.Router)();
doctor_routes.use('/admin');
exports.default = doctor_routes;
