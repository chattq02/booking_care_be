import { Request, Response } from 'express'
import { MediaService } from 'src/services/media/file.service'

class MediaController {
  private mediaService = new MediaService()

  // upload file
  upload = async (req: Request, res: Response) => {
    return this.mediaService.upload(req, res)
  }
}

export const mediaController = new MediaController()
