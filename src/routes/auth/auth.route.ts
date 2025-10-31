import authController from 'src/controllers/auth/auth.controller'
import { TokenDto } from 'src/dtos/auth/token.dto'
import { LoginDto } from 'src/dtos/auth/login.dto'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: auth_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

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
publicRoute.post('/login', validateDto(LoginDto), wrapRequestHandler(authController.loginController))
/**
 * @openapi
 * /v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản
 *     security:
 *       - bearerAuth: []
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
protectedRoute.post('/register', validateDto(RegisterDto), wrapRequestHandler(authController.registerController))

/**
 * @openapi
 * /v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: refresh-token
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: refresh-token successfully
 */
publicRoute.post('/refresh-token', validateDto(TokenDto), wrapRequestHandler(authController.refreshTokenController))

/**
 * @openapi
 * /v1/auth/me:
 *   post:
 *     tags:
 *       - Auth
 *     summary: me
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               lang:
 *                 type: string
 *                 example: Vn
 *     responses:
 *       200:
 *         description: get me successfully
 */
protectedRoute.post('/me', wrapRequestHandler(authController.meController))

/**
 * @openapi
 * /v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: forgot-password
 *     security:
 *       - bearerAuth: []
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
 *         description: refresh-token successfully
 */
protectedRoute.post(
  '/forgot-password',
  validateDto(TokenDto),
  wrapRequestHandler(authController.forgotPasswordController)
)

/**
 * @openapi
 * /v1/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: reset-password
 *     security:
 *       - bearerAuth: []
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
 *         description: refresh-token successfully
 */
protectedRoute.post(
  '/reset-password',
  validateDto(TokenDto),
  wrapRequestHandler(authController.resetPasswordController)
)

/**
 * @openapi
 * /v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: logout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               lang:
 *                 type: string
 *                 example: Vn
 *     responses:
 *       200:
 *         description: logout successfully
 */
protectedRoute.post('/logout', wrapRequestHandler(authController.logoutController))

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
publicRoute.post('/verify-email', validateDto(TokenDto), wrapRequestHandler(authController.verifyEmailController))

/**
 * @openapi
 * /v1/auth/re-send-verify-email:
 *   post:
 *     tags:
 *       - Auth
 *     summary: re-send-verify-email
 *     security:
 *       - bearerAuth: []
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
 *         description: Re-send email verified successfully
 */
publicRoute.post(
  '/re-send-verify-email',
  validateDto(TokenDto),
  wrapRequestHandler(authController.reSendVerifyEmailController)
)

export default auth_routes
