import { Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { handleFileUpload } from 'src/utils/file'
import { ResultsReturned } from 'src/utils/results-api'

export class MediaService {
  upload = async (req: Request, res: Response) => {
    const file = await handleFileUpload(req)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Tải file thành công',
        data: {
          TimeUpload: file.created_at,
          FileSize: file.bytes,
          FileName: file.originalFilename,
          FileType: file.format,
          FileUrl: file.url
        }
      })
    )
  }
}
