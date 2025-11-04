import { Router } from 'express'
import mst_doctor_routes from './doctor.route'

const doctor_routes = Router()

doctor_routes.use(mst_doctor_routes)

export default doctor_routes
