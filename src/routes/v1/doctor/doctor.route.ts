import doctorController from 'src/controllers/doctor/doctor.controller'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: mst_doctor_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

/**
 * @openapi
 * /v1/doctor/get-list-doctor:
 *   get:
 *     tags:
 *       - Doctor
 *     summary: Danh sách bác sĩ (có phân trang, tìm kiếm, trạng thái)
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
 *         name: departmentId
 *         schema:
 *           type: number
 *           example: 1
 *         required: false
 *         description: Tìm kiếm theo phòng ban
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: number
 *           example: 1
 *         required: false
 *         description: Tìm kiếm theo mã cơ sở
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, InActive, Banned, Pending, All]
 *           example: All
 *         required: false
 *         description: Lọc theo trạng thái
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
protectedWithRoles.get(
  '/get-list-doctor',
  ['ADMIN', 'USER'],
  validateDto(GetListDoctorQueryDto),
  wrapRequestHandler(doctorController.getListDoctorController)
)

export default mst_doctor_routes
