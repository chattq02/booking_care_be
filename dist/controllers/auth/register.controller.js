"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthController {
    async registerController(req, res) {
        const { name, email, password, role } = req.body;
        return res.status(200).json({ status: 'ok' });
    }
}
const authController = new AuthController();
exports.default = authController;
