import { Router } from 'express'
import authController from 'src/controllers/auth/auth.controller'
import { VerifyEmailDto } from 'src/dtos/auth/email.dto'
import { LoginDto } from 'src/dtos/auth/login.dto'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'

const auth_routes = Router()

/**
 * @openapi
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập
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
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *         description: Thiếu thông tin đăng nhâp
 */
auth_routes.use('/login', validateDto(LoginDto), wrapRequestHandler(authController.loginController))

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
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 example: USER
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *       400:
 *         description: Thiếu thông tin đăng ký
 */
auth_routes.use('/register', validateDto(RegisterDto), wrapRequestHandler(authController.registerController))

/**
 * @openapi
 * /v1/auth/verify-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: verify email
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
auth_routes.use('/verify-email', validateDto(VerifyEmailDto), wrapRequestHandler(authController.verifyEmailController))

export default auth_routes
