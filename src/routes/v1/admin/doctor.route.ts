import { createRoleRouter } from 'src/utils/role-route'

const { router: doctor_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

export default doctor_routes
