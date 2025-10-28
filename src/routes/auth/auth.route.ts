import { Router } from 'express'
import authController from 'src/controllers/auth/auth.controller'
import { VerifyEmailDto } from 'src/dtos/auth/email.dto'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'

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
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 example: USER
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
auth_routes.use('/register', validateDto(RegisterDto), authController.registerController)

/**
 * @openapi
 * /v1/auth/verify-email-admin:
 *   post:
 *     tags:
 *       - Auth
 *     summary: verify email admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
auth_routes.use('/verify-email-admin', validateDto(VerifyEmailDto), authController.verifyEmailAdminController)

export default auth_routes
