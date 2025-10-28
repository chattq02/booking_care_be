import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'

import { ErrorWithStatus } from '../utils/Errors'
import { httpStatusCode } from 'src/constants/httpStatus'

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      isSuccess: false,
      data: omit(err, ['status'])
    })
  }
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })

  res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
    isSuccess: false,
    data: omit(err, ['stack'])
  })
}
