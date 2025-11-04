import { Router } from 'express'
import doctor_routes from './doctor.route'
import academicTitleRoutes from './academic_title.route'

const admin_routes = Router()

admin_routes.use(doctor_routes)
admin_routes.use(academicTitleRoutes)

export default admin_routes
