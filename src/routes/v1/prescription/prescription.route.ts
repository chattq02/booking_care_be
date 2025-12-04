import prescriptionController from 'src/controllers/prescription/prescription.controller'
import { CreatePrescriptionDto } from 'src/dtos/prescription/create.dto'
import { UpdatePrescriptionDto } from 'src/dtos/prescription/update.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: prescription_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

// ======================================================
// 🟢 Tạo đơn thuốc
// ======================================================
/**
 * @swagger
 * /v1/prescription:
 *   post:
 *     summary: Tạo đơn thuốc mới
 *     tags: [Prescription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentId:
 *                 type: integer
 *                 example: 12
 *               diagnosis:
 *                 type: string
 *                 example: "Viêm họng cấp"
 *               notes:
 *                 type: string
 *                 example: "Uống nhiều nước"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medicineId:
 *                       type: integer
 *                       example: 3
 *                     medicineName:
 *                       type: string
 *                       example: "Paracetamol"
 *                     dosage:
 *                       type: string
 *                       example: "500mg"
 *                     quantity:
 *                       type: integer
 *                       example: 10
 *                     usageInstruction:
 *                       type: string
 *                       example: "Ngày 2 lần sau ăn"
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
protectedRoute.post(
  '/prescription',
  validateDto(CreatePrescriptionDto),
  wrapRequestHandler(prescriptionController.createPrescription)
)

// ======================================================
// 🟡 Cập nhật đơn thuốc
// ======================================================
/**
 * @swagger
 * /v1/prescription/{id}:
 *   put:
 *     summary: Cập nhật đơn thuốc
 *     tags: [Prescription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diagnosis:
 *                 type: string
 *                 example: "Viêm họng mãn tính"
 *               notes:
 *                 type: string
 *                 example: "Điều chỉnh thuốc"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     medicineId:
 *                       type: integer
 *                       example: 3
 *                     medicineName:
 *                       type: string
 *                       example: "Azithromycin"
 *                     dosage:
 *                       type: string
 *                       example: "250mg"
 *                     quantity:
 *                       type: integer
 *                       example: 6
 *                     usageInstruction:
 *                       type: string
 *                       example: "Ngày 1 lần"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
protectedRoute.put(
  '/prescription/:id',
  validateDto(UpdatePrescriptionDto),
  wrapRequestHandler(prescriptionController.updatePrescription)
)

// ======================================================
// 🔵 Lấy danh sách đơn thuốc
// ======================================================
/**
 * @swagger
 * /v1/prescription:
 *   get:
 *     summary: Lấy danh sách đơn thuốc
 *     tags: [Prescription]
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
 *           default: 20
 *       - in: query
 *         name: appointmentId
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Thành công
 */
protectedWithRoles.get(
  '/prescription',
  ['ADMIN', 'DOCTOR'],
  wrapRequestHandler(prescriptionController.getListPrescriptions)
)

// ======================================================
// 🟠 Lấy đơn thuốc theo ID
// ======================================================
/**
 * @swagger
 * /v1/prescription/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn thuốc
 *     tags: [Prescription]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
publicRoute.get('/prescription/:id', wrapRequestHandler(prescriptionController.getPrescriptionById))

// ======================================================
// 🔴 Xóa đơn thuốc
// ======================================================
/**
 * @swagger
 * /v1/prescription/{id}:
 *   delete:
 *     summary: Xóa đơn thuốc
 *     tags: [Prescription]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
protectedRoute.delete('/prescription/:id', wrapRequestHandler(prescriptionController.deletePrescription))

export default prescription_routes
