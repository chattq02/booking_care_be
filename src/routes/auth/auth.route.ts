import { Router } from 'express'
import authController from 'src/controllers/auth/auth.controller'

const auth_routes = Router()

/**
 * @openapi
 * /v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản
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
 *               name:
 *                 type: string
 *                 example: user name
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refetch_token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCIsss6IkpXVCJ9...
 *       400:
 *         description: Thiếu thông tin đăng ký
 */
auth_routes.use('/register', authController.registerController)

export default auth_routes
