import { NextFunction, Request, Response } from 'express'
import { ResultsReturned } from 'src/utils/results-api'
import { httpStatusCode } from 'src/constants/httpStatus'

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error Middleware:', err)

  // Xác định mã lỗi mặc định
  let status = err.status || httpStatusCode.INTERNAL_SERVER_ERROR
  let message = err.message || 'Lỗi hệ thống, vui lòng thử lại sau.'

  // Trường hợp lỗi xác thực JWT
  if (err.name === 'JsonWebTokenError') {
    status = httpStatusCode.UNAUTHORIZED
    message = 'Token không hợp lệ'
  }
  if (err.name === 'TokenExpiredError') {
    status = httpStatusCode.UNAUTHORIZED
    message = 'Token đã hết hạn.'
  }
  // Trả response đồng nhất
  return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(
    new ResultsReturned({
      isSuccess: false,
      status,
      message,
      data: err
    })
  )
}
