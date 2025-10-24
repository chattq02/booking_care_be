import { Router } from 'express'
import mediasController from '../controllers/medias.controllers'
import { wrapRequestHandler } from '../utils/handlers'

const mediasRouter = Router()

mediasRouter.post(
  '/upload-images',
  // accessTokenValidator,
  wrapRequestHandler(mediasController.uploadSingleImageController)
)
// mediasRouter.post('/upload-videos', accessTokenValidator, wrapRequestHandler(mediasController.uploadVideoController))

export default mediasRouter
