import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'
import { MEDIAS_MESSAGES } from '../constants/messages-handle/media.messages'
import mediasService from '../services/media.services'
const cloudinary = require('cloudinary').v2

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadSingleImage(req)

  return res.json({
    isSuccess: true,
    message: 'Upload successful',
    Data: result
  })
}

class MediasController {
  async uploadSingleImageController(req: Request, res: Response, next: NextFunction) {
    const result = await mediasService.handleUploadSingleImage(req)

    return res.json({
      isSuccess: true,
      message: MEDIAS_MESSAGES.UPLOAD_SUCCESS,
      data: result
    })
  }

  // serveImageController(req: Request, res: Response, next: NextFunction) {
  //   const { name } = req.params
  //   return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
  //     if (err) {
  //       return res.status((err as any).status).send('Not Found')
  //     }
  //   })
  // }
  // serveVideoController(req: Request, res: Response, next: NextFunction) {
  //   const { name } = req.params
  //   return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
  //     if (err) {
  //       return res.status((err as any).status).send('Not Found')
  //     }
  //   })
  // }
}
const mediasController = new MediasController()
export default mediasController
