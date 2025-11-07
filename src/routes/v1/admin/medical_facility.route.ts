import { medicalFacilityController } from 'src/controllers/admin/medical_facility.controller'
import { CreateMedicalFacilityDto } from 'src/dtos/medical_facility/create.dto'
import { GetListQueryDto } from 'src/dtos/medical_facility/get_list.dto'
import { UpdateMedicalFacilityDto } from 'src/dtos/medical_facility/update.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: medicalFacilityRouter, protectedRoute, publicRoute } = createRoleRouter()

// 🟢 Tạo mới cơ sở y tế
/**
 * @swagger
 * /v1/admin/medical-facility:
 *   post:
 *     summary: Tạo cơ sở y tế mới
 *     tags: [MedicalFacility]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMedicalFacilityDto'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
protectedRoute.post(
  '/medical-facility',
  validateDto(CreateMedicalFacilityDto),
  wrapRequestHandler(medicalFacilityController.create)
)

// 🟡 Cập nhật cơ sở y tế
/**
 * @swagger
 * /v1/admin/medical-facility/{id}:
 *   put:
 *     summary: Cập nhật cơ sở y tế
 *     tags: [MedicalFacility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
protectedRoute.put(
  '/medical-facility/:id',
  validateDto(UpdateMedicalFacilityDto),
  wrapRequestHandler(medicalFacilityController.update)
)

// 🔵 Lấy danh sách cơ sở y tế (phân trang)
/**
 * @swagger
 * /v1/admin/medical-facility:
 *   get:
 *     summary: Lấy danh sách cơ sở y tế
 *     tags: [MedicalFacility]
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
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, InActive]
 *           example: All
 *         required: false
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Thành công
 */
publicRoute.get(
  '/medical-facility',
  validateDto(GetListQueryDto),
  wrapRequestHandler(medicalFacilityController.getList)
)

// 🟠 Lấy chi tiết 1 cơ sở y tế
/**
 * @swagger
 * /v1/admin/medical-facility/{id}:
 *   get:
 *     summary: Lấy chi tiết cơ sở y tế
 *     tags: [MedicalFacility]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lấy thành công
 */
publicRoute.get('/medical-facility/:id', wrapRequestHandler(medicalFacilityController.getDetail))

// 🔴 Xóa cơ sở y tế
/**
 * @swagger
 * /v1/admin/medical-facility/{id}:
 *   delete:
 *     summary: Xóa cơ sở y tế
 *     tags: [MedicalFacility]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa  phòng ban hoặc bác sĩ liên kết
 */
protectedRoute.delete('/medical-facility/:id', wrapRequestHandler(medicalFacilityController.delete))

// 👨‍⚕️ Lấy danh sách user (bác sĩ) theo cơ sở y tế
/**
 * @swagger
 * /v1/admin/medical-facility/{id}/users:
 *   get:
 *     summary: Lấy danh sách user (bác sĩ, nhân viên) thuộc cơ sở y tế
 *     tags: [MedicalFacility]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pagegetListDoctors
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: "Nguyen Van A"
 *     responses:
 *       200:
 *         description: Lấy danh sách user thành công
 */
publicRoute.get('/medical-facility/:id/users', wrapRequestHandler(medicalFacilityController.getUsersByFacility))

export default medicalFacilityRouter
