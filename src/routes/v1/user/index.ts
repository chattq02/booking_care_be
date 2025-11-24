import { Router } from 'express'
import doctor_user_routes from './doctor.route'
import facility_user_routes from './facility.route'

const user_routes = Router()

user_routes.use(doctor_user_routes)

user_routes.use(facility_user_routes)

export default user_routes
