import { Router } from 'express'
import authController from 'src/controllers/auth/register.controller'

const auth_routes = Router()

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập tài khoản
 *     description: Người dùng gửi email và mật khẩu để nhận token đăng nhập.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
auth_routes.use('/register', authController.registerController)

export default auth_routes
