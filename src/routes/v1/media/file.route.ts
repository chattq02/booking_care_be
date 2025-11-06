import { mediaController } from 'src/controllers/media/media.controller'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: file_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

/**
 * @swagger
 * /v1/file/upload:
 *   post:
 *     summary: Upload file (ảnh, video hoặc tài liệu)
 *     description: >
 *       Endpoint này cho phép người dùng đã đăng nhập tải file lên hệ thống.
 *       - Ảnh và video sẽ được lưu lên **Cloudinary**.
 *       - Các file khác (PDF, ZIP, DOCX, v.v.) sẽ được lưu lên **MEGA storage**.
 *     tags:
 *       - Media
 *     security:
 *       - BearerAuth: []   # yêu cầu token nếu bạn dùng protectedRoute
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File cần upload
 *     responses:
 *       200:
 *         description: Tải file thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Tải file thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     TimeUpload:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-06T12:45:32.123Z"
 *                     FileSize:
 *                       type: integer
 *                       example: 204800
 *                     FileName:
 *                       type: string
 *                       example: "document.pdf"
 *                     FileType:
 *                       type: string
 *                       example: "application/pdf"
 *                     FileUrl:
 *                       type: string
 *                       example: "https://res.cloudinary.com/.../document.pdf"
 *       400:
 *         description: Upload thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Tải file thất bại
 *                 data:
 *                   type: string
 *                   example: "Không có file tải lên hoặc lỗi kết nối Cloudinary"
 */
protectedRoute.post('/upload', wrapRequestHandler(mediaController.upload))

export default file_routes
