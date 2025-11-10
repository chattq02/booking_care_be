import { departmentController } from 'src/controllers/admin/specialty.controller'
import { CreateDepartmentDto } from 'src/dtos/specialty/create_department.dto'
import { GetListDepartmentQueryDto } from 'src/dtos/specialty/get-list_department.dto'
import { UpdateDepartmentDto } from 'src/dtos/specialty/update_department.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: departmentRoutes, protectedRoute, publicRoute } = createRoleRouter()

/**
 * @swagger
 * /v1/admin/department:
 *   post:
 *     summary: Tạo phòng ban mới
 *     tags: [Department]
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
 *                 example: Khoa Ngoại
 *               description:
 *                 type: string
 *                 example: Chuyên phẫu thuật
 *               facilityId:
 *                 type: integer
 *                 example: 1
 *               parentId:
 *                 type: integer
 *                 example: 1
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
protectedRoute.post('/department', validateDto(CreateDepartmentDto), wrapRequestHandler(departmentController.create))

/**
 * @swagger
 * /v1/admin/department/{id}:
 *   put:
 *     summary: Cập nhật phòng ban
 *     tags: [Department]
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
 *                 example: Khoa Ngoại
 *               description:
 *                 type: string
 *                 example: Chuyên phẫu thuật
 *               facilityId:
 *                 type: integer
 *                 example: 1
 *               parentId:
 *                 type: integer
 *                 example: 1
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
protectedRoute.put('/department/:id', validateDto(UpdateDepartmentDto), wrapRequestHandler(departmentController.update))

/**
 * @swagger
 * /v1/admin/department:
 *   get:
 *     summary: Lấy danh sách phòng ban (dạng list)
 *     tags: [Department]
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
 *         description: Thành công
 */
publicRoute.get('/department', validateDto(GetListDepartmentQueryDto), wrapRequestHandler(departmentController.getList))

/**
 * @swagger
 * /v1/admin/department/tree:
 *   get:
 *     summary: Lấy danh sách phòng ban dạng cây
 *     tags: [Department]
 *     parameters:
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Lấy thành công
 */
publicRoute.get('/department/tree', wrapRequestHandler(departmentController.getTree))

/**
 * @swagger
 * /v1/admin/department/{id}:
 *   delete:
 *     summary: Xóa phòng ban
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: facilityId
 *         schema:
 *           type: integer
 *           example: 100
 *         description: Id của cơ sở y tế
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Không thể xóa vì có bác sĩ thuộc khoa này
 */
protectedRoute.delete('/department/:id/:facilityId', wrapRequestHandler(departmentController.delete))

/**
 * @swagger
 * /v1/admin/department/{parentId}/children:
 *   get:
 *     summary: Lấy danh sách phòng ban con theo id cha
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của phòng ban cha
 *     responses:
 *       200:
 *         description: Lấy thành công
 */
publicRoute.get('/department/:parentId/children', wrapRequestHandler(departmentController.getChildren))
export default departmentRoutes
