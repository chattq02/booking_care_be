import scheduleController from 'src/controllers/schedule/schedule.controller'
import { GetListScheduleQueryDto } from 'src/dtos/schedule/get-list.dto'
import { CreateScheduleDto } from 'src/dtos/schedule/create.dto'
import { UpdateScheduleDto } from 'src/dtos/schedule/update.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: schedule_routes, protectedRoute, protectedWithRoles } = createRoleRouter()

/**
 * @openapi
 * /v1/schedule/get-list:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Lấy danh sách lịch (có phân trang)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: Id
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [DOCTOR, DEPARTMENT, FACILITY]
 *     responses:
 *       200:
 *         description: Thành công — trả về danh sách lịch
 */
protectedWithRoles.get(
  '/get-list',
  ['ADMIN', 'USER'],
  validateDto(GetListScheduleQueryDto),
  wrapRequestHandler(scheduleController.getListSchedule)
)

/**
 * @openapi
 * /v1/schedule/save:
 *   post:
 *     tags:
 *       - Schedule
 *     summary: Tạo lịch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: number
 *                 example: 1
 *               id:
 *                 type: number
 *                 example: 1
 *               facilityId:
 *                 type: number
 *                 example: 1
 *               departmentId:
 *                 type: number
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "11-11-2022"
 *               slots:
 *                 type: object
 *                 example:
 *                   "1":
 *                     - startTime: "08:00"
 *                       endTime: "09:00"
 *                       price: 200000
 *                       isSelected: true
 *                     - startTime: "09:00"
 *                       endTime: "10:00"
 *                       price: 200000
 *                       isSelected: false
 *                   "2":
 *                     - startTime: "08:00"
 *                       endTime: "09:00"
 *                       price: 200000
 *                       isSelected: true
 *                 description: Danh sách các slot thời gian
 *               type:
 *                 enum: [DOCTOR, DEPARTMENT, FACILITY]
 *                 example: FACILITY
 *               status:
 *                 enum: [NORMAL, OFF, FIXED]
 *                 example: NORMAL
 *     responses:
 *       201:
 *         description: Lịch được tạo thành công
 */
protectedWithRoles.post(
  '/save',
  ['ADMIN'],
  validateDto(CreateScheduleDto),
  wrapRequestHandler(scheduleController.createSchedule)
)

/**
 * @openapi
 * /v1/schedule/upsert:
 *   put:
 *     tags:
 *       - Schedule
 *     summary: Cập nhật lịch
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateScheduleDto'
 *     responses:
 *       200:
 *         description: Lịch được cập nhật thành công
 */
protectedWithRoles.put(
  '/upsert',
  ['ADMIN'],
  validateDto(UpdateScheduleDto),
  wrapRequestHandler(scheduleController.updateSchedule)
)

/**
 * @openapi
 * /v1/schedule/delete/{id}:
 *   delete:
 *     tags:
 *       - Schedule
 *     summary: Xóa lịch
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lịch được xóa thành công
 */
protectedWithRoles.delete('/delete/:id', ['ADMIN'], wrapRequestHandler(scheduleController.deleteSchedule))

/**
 * @openapi
 * /v1/schedule/get-schedule/{id}/{type}:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Lấy thông tin lịch
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lấy thông tin lịch hẹn thành công
 */
protectedRoute.get('/get-schedule/:id/:type', wrapRequestHandler(scheduleController.getScheduleById))

/**
 * @openapi
 * /v1/schedule/get-schedule-doctor/{id}/{type}:
 *   get:
 *     tags:
 *       - Schedule
 *     summary: Lấy danh sách lịch với phân loại
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID của bác sĩ, phòng ban hoặc cơ sở
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [DOCTOR, DEPARTMENT, FACILITY]
 *           example: FACILITY
 *         description: Loại lịch
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày cần lấy lịch (YYYY-MM-DD)
 *       - in: query
 *         name: facilityCode
 *         required: false
 *         schema:
 *           type: string
 *         description: Mã cơ sở (tùy chọn)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: per_page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch thành công
 */

protectedRoute.get(
  '/get-schedule-doctor/:id/:type',
  validateDto(GetListScheduleQueryDto),
  wrapRequestHandler(scheduleController.getSchedulesByDoctor)
)

/**
 * @openapi
 * /v1/schedule/get-schedule-doctor-day:
 *   get:
 *     tags:
 *       - Schedule
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
 *       - in: query
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id của phòng ban
 *       - in: query
 *         name: facilityId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Id của cơ sở
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch thành công
 */

protectedRoute.get('/get-schedule-doctor-day', wrapRequestHandler(scheduleController.getSchedulesByDoctorDay))

export default schedule_routes
