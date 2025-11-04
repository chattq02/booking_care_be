import { Router } from 'express'
import doctor_routes from './doctor.route'

const admin_routes = Router()

admin_routes.use(doctor_routes)

export default admin_routes
