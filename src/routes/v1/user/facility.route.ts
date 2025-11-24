import { medicalFacilityController } from 'src/controllers/admin/medical_facility.controller'
import { GetListQueryDto } from 'src/dtos/medical_facility/get_list.dto'
import { validateDto } from 'src/middlewares/validatorDTO.middleware'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: facility_user_routes, publicRoute } = createRoleRouter()
// 🔵 Lấy danh sách cơ sở y tế (phân trang)
/**
 * @swagger
 * /v1/user/medical-facility:
 *   get:
 *     summary: Lấy danh sách cơ sở y tế
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
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
publicRoute.get(
  '/medical-facility',
  validateDto(GetListQueryDto),
  wrapRequestHandler(medicalFacilityController.getListActive)
)

export default facility_user_routes
