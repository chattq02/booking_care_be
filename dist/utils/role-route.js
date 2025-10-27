"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoleRouter = createRoleRouter;
const express_1 = require("express");
// import { authorize } from "../middleware/authorize";
/**
 * Tạo router hỗ trợ:
 * - protected route theo role
 * - public route
 */
function createRoleRouter(defaultRole) {
    const router = (0, express_1.Router)();
    // protected route theo role mặc định
    const protectedRoute = (method, path, handlers, roles // override role nếu muốn
    ) => {
        const r = roles || (defaultRole ? [defaultRole] : []);
        // router[method](path, r.length ? authorize(r) : [], ...(Array.isArray(handlers) ? handlers : [handlers]));
    };
    // public route không cần token
    const publicRoute = (method, path, handlers) => {
        router[method](path, ...(Array.isArray(handlers) ? handlers : [handlers]));
    };
    return { router, protectedRoute, publicRoute };
}
