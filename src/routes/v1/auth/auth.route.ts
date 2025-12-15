import authController from 'src/controllers/auth/auth.controller'
import { TokenDto } from 'src/dtos/auth/token.dto'
import { LoginDto } from 'src/dtos/auth/login.dto'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'
import { FacilityDto } from 'src/dtos/auth/select-facility.dto'
import { UpdateUserDto } from 'src/dtos/auth/update-user.dto'
import { RegisterDoctorDto } from 'src/dtos/auth/register-doctor.dto'
import { RegisterUserDto } from 'src/dtos/auth/register-user.dto'
import { EmailDto } from 'src/dtos/auth/email.dto'
import { ChangeStatusDto } from 'src/dtos/auth/change-status.dto'

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
 * /v1/auth/select-facility:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Chọn cơ sở
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: BV12346
 *               uuid:
 *                 type: string
 *                 example: emaasasfhiqwrqr...
 *               id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: chọn thành công
 *       400:
 *         description: chọn thất bại
 */
protectedRoute.post('/select-facility', validateDto(FacilityDto), wrapRequestHandler(authController.selectFacility))

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
 *               roles:
 *                 type: string
 *                 example:  [{ role: "ADMIN" }]
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
 *               lang:
 *                 type: string
 *                 example: vn
 *     responses:
 *       200:
 *         description: refresh-token successfully
 */
publicRoute.post('/refresh-token', wrapRequestHandler(authController.refreshTokenController))

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
publicRoute.post('/forgot-password', validateDto(EmailDto), wrapRequestHandler(authController.forgotPasswordController))

/**
 * @openapi
 * /v1/auth/forgot-password-doctor:
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
 *                 example: doctor@example.com
 *     responses:
 *       200:
 *         description: refresh-token successfully
 */
protectedWithRoles.post(
  '/forgot-password-doctor',
  ['ADMIN'],
  validateDto(EmailDto),
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
 * /v1/auth/change-status-doctor:
 *   post:
 *     tags:
 *       - Auth
 *     summary: change-status-doctor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               user_status:
 *                 type: string
 *                 example: "Banned"
 *     responses:
 *       200:
 *         description: refresh-token successfully
 */
protectedRoute.post(
  '/change-status-doctor',
  validateDto(ChangeStatusDto),
  wrapRequestHandler(authController.changeStatusDoctorController)
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

/**
 * @openapi
 * /v1/auth/user:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Cập nhật thông tin user
 *     description: Cập nhật thông tin người dùng theo ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Trịnh Quang Chất Updated"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               phone:
 *                 type: string
 *                 example: "0787267412"
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-01T17:00:00.000Z"
 *               cccd:
 *                 type: string
 *                 example: "123456789012"
 *               healthInsurance:
 *                 type: string
 *                 example: "BH123456789"
 *               occupation:
 *                 type: string
 *                 example: "Software Developer"
 *               address:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *     responses:
 *       200:
 *         description: Cập nhật user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     uuid:
 *                       type: string
 *                       example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 *                     email:
 *                       type: string
 *                       example: "chat.tq.updated@solashi.com"
 *                     fullName:
 *                       type: string
 *                       example: "Trịnh Quang Chất Updated"
 *                     phone:
 *                       type: string
 *                       example: "0787267412"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     user_type:
 *                       type: string
 *                       example: "Patient"
 *                     user_status:
 *                       type: string
 *                       example: "Active"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy user
 *       500:
 *         description: Lỗi server
 */
protectedRoute.put('/user', validateDto(UpdateUserDto), wrapRequestHandler(authController.updateUser))

/**
 * @openapi
 * /v1/auth/register-doctor:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản bác sĩ
 *     description: API dành cho Admin tạo mới tài khoản bác sĩ trong một cơ sở.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn Bác Sĩ"
 *               email:
 *                 type: string
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               cccd:
 *                 type: string
 *                 example: "123456789012"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "male"
 *               specialization:
 *                 type: string
 *                 example: "Cardiology"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar.png"
 *               facilityId:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Đăng ký bác sĩ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Doctor registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 10
 *                     uuid:
 *                       type: string
 *                       example: "230f5c0e-f2cc-4b34-981d-123456789000"
 *                     fullName:
 *                       type: string
 *                       example: "Nguyễn Văn Bác Sĩ"
 *                     email:
 *                       type: string
 *                       example: "doctor@example.com"
 *                     phone:
 *                       type: string
 *                       example: "0987654321"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     specialization:
 *                       type: string
 *                       example: "Cardiology"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.png"
 *                     facilityId:
 *                       type: number
 *                       example: 2
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
protectedRoute.post(
  '/register-doctor',
  validateDto(RegisterDoctorDto),
  wrapRequestHandler(authController.registerDoctorController)
)

/**
 * @openapi
 * /v1/auth/register-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản người dùng
 *     description: API dành cho người dùng tạo mới tài khoản.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn Bác Sĩ"
 *               email:
 *                 type: string
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Đăng ký bác sĩ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Doctor registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 10
 *                     uuid:
 *                       type: string
 *                       example: "230f5c0e-f2cc-4b34-981d-123456789000"
 *                     fullName:
 *                       type: string
 *                       example: "Nguyễn Văn A"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
publicRoute.post(
  '/register-user',
  validateDto(RegisterUserDto),
  wrapRequestHandler(authController.registerUserController)
)

export default auth_routes
