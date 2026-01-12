import { Router } from 'express'
import doctor_user_routes from './doctor.route'
import facility_user_routes from './facility.route'
import appointment_routes from '../appointment/appointment.route'
import chat_ai_routes from '../chat/chat.route'

const user_routes = Router()

user_routes.use(doctor_user_routes)

user_routes.use(facility_user_routes)
user_routes.use(appointment_routes)
user_routes.use(chat_ai_routes)

export default user_routes
