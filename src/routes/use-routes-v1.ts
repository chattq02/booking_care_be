import { Router } from 'express'
import user_routes from './user/base'
import admin_routes from './admin'
import doctor_routes from './doctor'
import auth_routes from './auth/auth.route'

const use_routes_v1 = Router()

// use_routes_v1.use('/user', user_routes)
// use_routes_v1.use('/admin', admin_routes)
// use_routes_v1.use('/doctor', doctor_routes)
use_routes_v1.use('/auth', auth_routes)

export default use_routes_v1
