import medicineController from 'src/controllers/medicine/medicine.controller'
import { CreateMedicineDto } from 'src/dtos/medicine/create.dto'
import { UpdateMedicineDto } from 'src/dtos/medicine/update.dto'

import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: medicine_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

// ======================================================
// 🟢 Tạo thuốc mới
// ======================================================
/**
 * @swagger
 * /v1/medicine:
 *   post:
 *     summary: Thêm thuốc mới vào hệ thống
 *     tags: [Medicine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Paracetamol"
 *               description:
 *                 type: string
 *                 example: "Thuốc giảm đau hạ sốt"
 *               unit:
 *                 type: string
 *                 example: "Viên"
 *               manufacturer:
 *                 type: string
 *                 example: "DHG Pharma"
 *               price:
 *                 type: integer
 *                 example: 10000
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tạo thuốc thành công
 */
protectedRoute.post('/medicine', validateDto(CreateMedicineDto), wrapRequestHandler(medicineController.createMedicine))

// ======================================================
// 🟡 Cập nhật thuốc
// ======================================================
/**
 * @swagger
 * /v1/medicine/{id}:
 *   put:
 *     summary: Cập nhật thông tin thuốc
 *     tags: [Medicine]
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
 *               name:
 *                 type: string
 *                 example: "Ibuprofen"
 *               description:
 *                 type: string
 *                 example: "Giảm đau kháng viêm"
 *               unit:
 *                 type: string
 *                 example: "Viên"
 *               manufacturer:
 *                 type: string
 *                 example: "Traphaco"
 *               price:
 *                 type: integer
 *                 example: 15000
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật thuốc thành công
 */
protectedRoute.put(
  '/medicine/:id',
  validateDto(UpdateMedicineDto),
  wrapRequestHandler(medicineController.updateMedicine)
)

// ======================================================
// 🔵 Lấy danh sách thuốc
// ======================================================
/**
 * @swagger
 * /v1/medicine:
 *   get:
 *     summary: Lấy danh sách thuốc
 *     tags: [Medicine]
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
 *         name: name
 *         schema:
 *           type: string
 *           example: "Paracetamol"
 *     responses:
 *       200:
 *         description: Thành công
 */
protectedWithRoles.get('/medicine', ['ADMIN', 'DOCTOR'], wrapRequestHandler(medicineController.getListMedicines))

// ======================================================
// 🟠 Lấy thuốc theo ID
// ======================================================
/**
 * @swagger
 * /v1/medicine/{id}:
 *   get:
 *     summary: Lấy chi tiết thuốc theo ID
 *     tags: [Medicine]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 */
publicRoute.get('/medicine/:id', wrapRequestHandler(medicineController.getMedicineById))

// ======================================================
// 🔴 Xóa thuốc
// ======================================================
/**
 * @swagger
 * /v1/medicine/{id}:
 *   delete:
 *     summary: Xóa thuốc khỏi hệ thống
 *     tags: [Medicine]
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
protectedRoute.delete('/medicine/:id', wrapRequestHandler(medicineController.deleteMedicine))

export default medicine_routes
