import { createRoleRouter } from 'src/utils/role-route'
import doctorController from 'src/controllers/doctor/doctor.controller'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'

const { router: doctor_user_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

/**
 * @openapi
 * /v1/user/get-list-doctor:
 *   get:
 *     tags:
 *       - Docto User
 *     summary: Danh sách bác sĩ
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Trang hiện tại
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           example: 100
 *         required: false
 *         description: Số lượng mỗi trang
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: "Nguyen"
 *         required: false
 *         description: Tìm kiếm theo tên, email hoặc số điện thoại
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: number
 *           example: 1
 *         required: false
 *         description: Tìm kiếm theo mã cơ sở
 *     responses:
 *       200:
 *         description: Thành công — trả về danh sách bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current_page:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       status:
 *                         type: string
 *                 next_page_url:
 *                   type: string
 *                   nullable: true
 *                 path:
 *                   type: string
 *                 per_page:
 *                   type: integer
 *                 prev_page_url:
 *                   type: string
 *                   nullable: true
 *                 to:
 *                   type: integer
 *                 total:
 *                   type: integer
 */
publicRoute.get(
  '/get-list-doctor',
  validateDto(GetListDoctorQueryDto),
  wrapRequestHandler(doctorController.getListDoctorUserController)
)

/**
 * @openapi
 * /v1/user/get-doctor/{id}:
 *   get:
 *     tags:
 *       - Docto User
 *     summary: Danh sách bác sĩ
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: ID bác sĩ
 *     responses:
 *       200:
 *         description: Thành công — trả về danh sách bác sĩ
 */
publicRoute.get('/get-doctor/:id', wrapRequestHandler(doctorController.getDoctorById))

/**
 * @openapi
 * /v1/user/get-schedule-doctor-day:
 *   get:
 *     tags:
 *       - Docto User
 *     summary: Lấy chi tiết lịch theo ngày cho bác sĩ
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           description: ID của bác sĩ
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày cần lấy lịch (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch thành công
 */

publicRoute.get('/get-schedule-doctor-day', wrapRequestHandler(doctorController.getScheduleDoctorByDate))

export default doctor_user_routes
