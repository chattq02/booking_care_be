import { Router } from 'express'
import doctor_routes from './doctor.route'
import academicTitleRoutes from './academic_title.route'
import departmentRoutes from './specialty.route'

const admin_routes = Router()

admin_routes.use(doctor_routes)
admin_routes.use(academicTitleRoutes)
admin_routes.use(departmentRoutes)

export default admin_routes
