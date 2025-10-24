import { Request } from 'express'
import { handleFileUpload } from '../utils/file'

interface IFile {
  created_at?: string
  originalFilename?: string
  format?: string
  url?: string
  bytes?: number
}

class MediasService {
  async handleUploadSingleImage(req: Request) {
    const file = (await handleFileUpload(req)) as IFile

    return {
      TimeUpload: file.created_at,
      FileSize: file.bytes,
      FileName: file.originalFilename,
      FileType: file.format,
      FileUrl: file.url
    }
  }
}

const mediasService = new MediasService()

export default mediasService
