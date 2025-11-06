import { Router } from 'express'
import doctor_routes from './doctor.route'
import academicTitleRoutes from './academic_title.route'
import departmentRoutes from './specialty.route'
import medicalFacilityRouter from './medical_facility.route'

const admin_routes = Router()

admin_routes.use(doctor_routes)
admin_routes.use(academicTitleRoutes)
admin_routes.use(departmentRoutes)
admin_routes.use(medicalFacilityRouter)

export default admin_routes
