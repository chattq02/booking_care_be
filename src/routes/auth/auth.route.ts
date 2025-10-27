import { Router } from 'express'
import authController from 'src/controllers/auth/register.controller'

const auth_routes = Router()

auth_routes.use('/register', authController.registerController)
// auth_routes.use('/login')

export default auth_routes
