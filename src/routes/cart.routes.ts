import { Router } from 'express'
import { wrapRequestHandler } from '../utils/handlers'
import { accessTokenValidator } from 'src/middlewares/users.middlewares'
import cartController from 'src/controllers/cart.controllers'

const cartsRouter = Router()

cartsRouter.post('/addToCart', accessTokenValidator, wrapRequestHandler(cartController.addToCart))
cartsRouter.post('/GetCartUser', accessTokenValidator, wrapRequestHandler(cartController.getCartUser))
cartsRouter.post('/DeleteCourseCart', accessTokenValidator, wrapRequestHandler(cartController.deleteCourseCart))

export default cartsRouter
