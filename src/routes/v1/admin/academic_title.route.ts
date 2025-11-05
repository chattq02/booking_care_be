import { academicTitleController } from 'src/controllers/admin/academic_tilte.controller'
import { CreateAcademicTitleDto } from 'src/dtos/academic_title/create_academic_title.dto'
import { GetListAcademicTitleQueryDto } from 'src/dtos/academic_title/get_list_academic_title_query.dto'
import { UpdateAcademicTitleDto } from 'src/dtos/academic_title/update_academic_title.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: academicTitleRoutes, protectedRoute, publicRoute } = createRoleRouter('ADMIN')

/**
 * @swagger
 * /v1/admin/academic-title:
 *   post:
 *     summary: Tạo học vị mới
 *     tags: [AcademicTitle]
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
 *                 example: tên
 *               description:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Tên học vị đã tồn tại
 */
protectedRoute.post(
  '/academic-title',
  validateDto(CreateAcademicTitleDto),
  wrapRequestHandler(academicTitleController.create)
)

/**
 * @swagger
 * /v1/admin/academic-title/{id}:
 *   put:
 *     summary: Cập nhật học vị
 *     tags: [AcademicTitle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của học vị
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: tên
 *               description:
 *                 type: string
 *                 example: Ghi chú
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy học vị
 */
protectedRoute.put('/academic-title/:id', validateDto(UpdateAcademicTitleDto), academicTitleController.update)

/**
 * @swagger
 * /v1/admin/academic-title:
 *   get:
 *     summary: Lấy danh sách học vị
 *     tags: [AcademicTitle]
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
 *     responses:
 *       200:
 *         description: Lấy danh sách học vị thành công
 */
publicRoute.get(
  '/academic-title',
  validateDto(GetListAcademicTitleQueryDto),
  wrapRequestHandler(academicTitleController.getListController)
)

/**
 * @swagger
 * /v1/admin/academic-title/{id}:
 *   delete:
 *     summary: Xóa học vị
 *     tags: [AcademicTitle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID học vị
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa vì có người dùng đang sử dụng
 */
protectedRoute.delete('/academic-title/:id', wrapRequestHandler(academicTitleController.delete))

export default academicTitleRoutes
