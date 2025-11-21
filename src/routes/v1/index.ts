import { Router } from 'express'
import user_routes from './user'
import admin_routes from './admin'
import doctor_routes from './doctor'
import auth_routes from './auth/auth.route'
import file_routes from './media/file.route'
import schedule_routes from './schedule/schedule.route'

const use_routes_v1 = Router()

use_routes_v1.use('/user', user_routes)
use_routes_v1.use('/admin', admin_routes)
use_routes_v1.use('/schedule', schedule_routes)
use_routes_v1.use('/doctor', doctor_routes)
use_routes_v1.use('/auth', auth_routes)
use_routes_v1.use('/file', file_routes)

export default use_routes_v1
