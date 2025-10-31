import { NextFunction, Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { verifyToken } from 'src/utils/jwt'
import { ResultsReturned } from 'src/utils/results-api'

/**
 * Middleware xác thực token và kiểm tra quyền
 * @param roles Danh sách role được phép (ví dụ: ['admin', 'editor'])
 */
export function authMiddleware(roles: string[] = []) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token
      const allowedRoles = JSON.parse(req.cookies.roles)
      const userActive = req.cookies.user_active

      if (!accessToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json(
          new ResultsReturned({
            isSuccess: true,
            status: httpStatusCode.UNAUTHORIZED,
            message: 'Vui lòng đăng nhập lại',
            data: null
          })
        )
      }
      const decoded = await verifyToken({
        token: accessToken,
        secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN! as string
      })

      if (!decoded) {
        return res.status(httpStatusCode.UNAUTHORIZED).json(
          new ResultsReturned({
            isSuccess: true,
            status: httpStatusCode.UNAUTHORIZED,
            message: 'Vui lòng đăng nhập lại',
            data: null
          })
        )
      }

      if (userActive === 'InActive') {
        return res.status(httpStatusCode.UNAUTHORIZED).json(
          new ResultsReturned({
            isSuccess: true,
            status: httpStatusCode.UNAUTHORIZED,
            message: 'Tài khoản của bạn chưa được kích hoạt',
            data: null
          })
        )
      }

      const hasRole = roles.some((r) => allowedRoles.includes(r))

      if (roles.length && !hasRole) {
        return res.status(httpStatusCode.FORBIDDEN).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.FORBIDDEN,
            message: 'Bạn không có quyền truy cập',
            data: null
          })
        )
      }

      req.decoded_authorization = {
        user_id: decoded.sub,
        sub: decoded.sub,
        role: decoded.allowedRoles
      }
      next()
    } catch (error) {
      return res.status(httpStatusCode.UNAUTHORIZED).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.UNAUTHORIZED,
          message: 'Vui lòng đăng nhập lại',
          data: error
        })
      )
    }
  }
}
