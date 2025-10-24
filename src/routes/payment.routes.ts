import { Router } from 'express'
import { wrapRequestHandler } from '../utils/handlers'
import { accessTokenValidator } from 'src/middlewares/users.middlewares'
import cartController from 'src/controllers/cart.controllers'
import paymentController from 'src/controllers/payment.controllers'

const paymentRouter = Router()

paymentRouter.post('/addPayment', accessTokenValidator, wrapRequestHandler(paymentController.addToPayment))
paymentRouter.post('/GetListPaymentCart', accessTokenValidator, wrapRequestHandler(paymentController.GetListPayment))
paymentRouter.post('/CoursePayment', accessTokenValidator, wrapRequestHandler(paymentController.PaymentCourse))

export default paymentRouter
