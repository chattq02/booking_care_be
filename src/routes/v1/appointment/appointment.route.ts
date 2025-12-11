import appointmentController from 'src/controllers/appointment/appointment.controller'
import { CreateMedicalRecordDto } from 'src/dtos/appointment/create-medical-record.dto'
import { CreateAppointmentDto } from 'src/dtos/appointment/create.dto'
import { FindPatientAppointmentsDto } from 'src/dtos/appointment/find-patient-appointments.dto'
import { GetCompletedAndPaidAppointmentsDto } from 'src/dtos/appointment/get-completed-and-paid-appointments.dto'
import { GetCurrentAndNextPatientDto } from 'src/dtos/appointment/get-current-and-next-patient.dto'
import { GetListAppointmentByDoctorQueryDto } from 'src/dtos/appointment/get-list-by-doctor.dto'
import { GetListAppointmentByPatientQueryDto } from 'src/dtos/appointment/get-list-by-patient.dto'
import { GetListAppointmentQueryDto } from 'src/dtos/appointment/getList.dto'
import { ReportAppointmentDto } from 'src/dtos/appointment/report.dto'
import { UpdateAppointmentStatusDto } from 'src/dtos/appointment/update-status.dto'
import { UpdateAppointmentDto } from 'src/dtos/appointment/update.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: appointment_routes, protectedRoute, publicRoute } = createRoleRouter()

/**
 * @swagger
 * /v1/user/appointment:
 *   post:
 *     summary: Tạo cuộc hẹn mới
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - slotId
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               slotId:
 *                 type: string
 *                 example: slotID-1233
 *               note:
 *                 type: string
 *                 example: Bệnh nhân muốn khám chuyên sâu
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
protectedRoute.post(
  '/appointment',
  validateDto(CreateAppointmentDto),
  wrapRequestHandler(appointmentController.createAppointmentController)
)

/**
 * @swagger
 * /v1/user/appointment/{id}:
 *   put:
 *     summary: Cập nhật cuộc hẹn
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, COMPLETED, CANCELED]
 *                 example: CONFIRMED
 *               remark:
 *                 type: string
 *                 example: Bác sĩ xác nhận lịch khám
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy cuộc hẹn
 */
protectedRoute.put(
  '/appointment/:id',
  validateDto(UpdateAppointmentDto),
  wrapRequestHandler(appointmentController.updateAppointmentController)
)

/**
 * @swagger
 * /v1/user/appointment:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn
 *     tags: [Appointment]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELED]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
protectedRoute.get(
  '/appointment',
  validateDto(GetListAppointmentQueryDto),
  wrapRequestHandler(appointmentController.getAppointmentsController)
)

/**
 * @swagger
 * /v1/user/appointment/{id}:
 *   get:
 *     summary: Lấy chi tiết cuộc hẹn theo ID
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       404:
 *         description: Không tìm thấy cuộc hẹn
 */
protectedRoute.get('/appointment/:id', wrapRequestHandler(appointmentController.getAppointmentByIdController))

/**
 * @swagger
 * /v1/user/appointment/{id}:
 *   delete:
 *     summary: Xóa cuộc hẹn
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy cuộc hẹn
 */
protectedRoute.delete('/appointment/:id', wrapRequestHandler(appointmentController.deleteAppointmentController))

/**
 * @swagger
 * /v1/user/appointment/doctor/{doctorId}:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn của bác sĩ
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Lấy thành công
 */
protectedRoute.get(
  '/appointment/doctor/:doctorId',
  wrapRequestHandler(appointmentController.getAppointmentsByDoctorController)
)

/**
 * @swagger
 * /v1/user/appointment/patient/{patientId}:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn của bệnh nhân
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bệnh nhân
 *     responses:
 *       200:
 *         description: Lấy thành công
 */
protectedRoute.get(
  '/appointment/patient/:patientId',
  wrapRequestHandler(appointmentController.getAppointmentsByPatientController)
)

/**
 * @swagger
 * /v1/user/my-appointment:
 *   get:
 *     summary: Lấy danh sách lịch hẹn của tôi
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Thành công
 */
protectedRoute.get(
  '/my-appointment',
  validateDto(GetListAppointmentByPatientQueryDto),
  wrapRequestHandler(appointmentController.getAppointmentsByPatientController)
)

/**
 * @swagger
 * /v1/user/appointment-doctor:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn của bác sĩ
 *     tags: [Appointment]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           default: "...."
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-01-01"
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-01-31"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: "PENDING"
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELED]
 *     responses:
 *       200:
 *         description: Lấy thành công
 */
protectedRoute.get(
  '/appointment-doctor',
  validateDto(GetListAppointmentByDoctorQueryDto),
  wrapRequestHandler(appointmentController.getAppointmentsByDoctorController)
)

/**
 * @swagger
 * /v1/user/appointment/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái cuộc hẹn
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, COMPLETED, CANCELED]
 *                 example: CONFIRMED
 *               remark:
 *                 type: string
 *                 example: lý do
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy cuộc hẹn
 */
protectedRoute.put(
  '/appointment/:id/status',
  validateDto(UpdateAppointmentStatusDto),
  wrapRequestHandler(appointmentController.updateAppointmentStatusController)
)

/**
 * @swagger
 * /v1/user/appointment-report:
 *   get:
 *     summary: Báo cáo lịch hẹn (doanh thu, tổng lịch hẹn, lọc theo bác sĩ)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-01-01"
 *       - in: query
 *         name: toDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-01-31"
 *     responses:
 *       200:
 *         description: Báo cáo thành công
 */
protectedRoute.get(
  '/appointment-report',
  validateDto(ReportAppointmentDto),
  wrapRequestHandler(appointmentController.getAppointmentReportController)
)

/**
 * @swagger
 * /v1/user/appointment-current-next:
 *   get:
 *     summary: Lấy bệnh nhân hiện tại và bệnh nhân kế tiếp của bác sĩ trong ngày
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: ID của bác sĩ
 *       - in: query
 *         name: appointmentDate
 *         required: true
 *         schema:
 *           type: string
 *           example: "2025-12-09"
 *         description: Ngày cần kiểm tra (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
protectedRoute.get(
  '/appointment-current-next',
  validateDto(GetCurrentAndNextPatientDto),
  wrapRequestHandler(appointmentController.getCurrentAndNextPatientController)
)

/**
 * @swagger
 * /v1/user/appointment-completed-paid:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn đã hoàn thành & đã thanh toán (có phân trang)
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: integer
 *         description: Lọc theo bác sĩ
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           example: "2025-01-01"
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           example: "2025-01-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
protectedRoute.get(
  '/appointment-completed-paid',
  validateDto(GetCompletedAndPaidAppointmentsDto),
  wrapRequestHandler(appointmentController.getCompletedAndPaidAppointmentsController)
)

/**
 * @swagger
 * /v1/user/appointment/patient-detail/{patientId}:
 *   get:
 *     summary: Lấy chi tiết bệnh nhân trong cuộc hẹn
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bệnh nhân
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       404:
 *         description: Không tìm thấy thông tin lịch hẹn hoặc bệnh nhân
 */
protectedRoute.get(
  '/appointment-patient-detail-by-appointmentId/:appointmentId',
  wrapRequestHandler(appointmentController.getPatientDetailInAppointmentController)
)

/**
 * @swagger
 * /v1/user/appointment-medical-record:
 *   post:
 *     summary: Lưu thông tin khám bệnh + đơn thuốc
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *             properties:
 *               appointmentId:
 *                 type: integer
 *                 example: 123
 *               bloodPressure:
 *                 type: string
 *                 example: "120/80"
 *               heartRate:
 *                 type: integer
 *                 example: 78
 *               weight:
 *                 type: number
 *                 example: 65.5
 *               height:
 *                 type: number
 *                 example: 170
 *               temperature:
 *                 type: number
 *                 example: 36.8
 *               diagnosis:
 *                 type: string
 *                 example: "Viêm họng cấp"
 *               medicalHistory:
 *                 type: string
 *                 example: "Dị ứng thời tiết"
 *               conclusion:
 *                 type: string
 *                 example: "Đã ổn định"
 *               prescription:
 *                 type: object
 *                 properties:
 *                   diagnosis:
 *                     type: string
 *                     example: "Viêm họng cấp"
 *                   notes:
 *                     type: string
 *                     example: "Uống sau ăn"
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         medicineId:
 *                           type: integer
 *                           example: 283
 *                         name:
 *                           type: string
 *                           example: "Fresh Metal Sausages 451mg"
 *                         dosage:
 *                           type: integer
 *                           example: 600
 *                         unit:
 *                           type: string
 *                           example: "ml"
 *                         quantity:
 *                           type: integer
 *                           example: 1
 *                         frequency:
 *                           type: string
 *                           example: "2 lần/ngày"
 *                         duration:
 *                           type: string
 *                           example: "7 ngày"
 *                         mealTime:
 *                           type: string
 *                           example: "Trong bữa ăn"
 *                         startDate:
 *                           type: string
 *                           format: date
 *                           example: "2025-12-01"
 *                         endDate:
 *                           type: string
 *                           format: date
 *                           example: "2025-12-14"
 *                         usageInstruction:
 *                           type: string
 *                           example: "sssss"
 *                         note:
 *                           type: string
 *                           example: "ssssss"
 *     responses:
 *       201:
 *         description: Lưu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

protectedRoute.post(
  '/appointment-medical-record',
  validateDto(CreateMedicalRecordDto),
  wrapRequestHandler(appointmentController.saveMedicalRecordController)
)

/**
 * @swagger
 * /v1/user/appointment-patient-detail-history/{patientId}:
 *   get:
 *     summary: Lấy chi tiết bệnh nhân và lịch sử khám bệnh trong cuộc hẹn
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lấy thành công chi tiết bệnh nhân và lịch sử khám bệnh
 *       404:
 *         description: Không tìm thấy thông tin lịch hẹn hoặc bệnh nhân
 */
protectedRoute.get(
  '/appointment-patient-detail-history/:patientId',
  wrapRequestHandler(appointmentController.getPatientDetailAndHistoryController)
)

/**
 * @swagger
 * /v1/user/appointment-find:
 *   get:
 *     summary: Tìm kiếm lịch hẹn theo patientId, status, phân trang
 *     tags: [Appointment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
protectedRoute.get(
  '/appointment-find-status',
  validateDto(FindPatientAppointmentsDto),
  wrapRequestHandler(appointmentController.getFindPatientAppointmentsController)
)

export default appointment_routes
