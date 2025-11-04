import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'

export const validateDto = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = req.method === 'GET' ? req.query : req.body

    // ✅ Convert sang instance của class
    const dtoInstance = plainToInstance(DtoClass, data)

    const errors = await validate(dtoInstance, {
      whitelist: true, // chỉ giữ lại field có trong DTO
      forbidNonWhitelisted: true // báo lỗi nếu có field thừa
    })

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        data: err.constraints
      }))

      return res.status(400).json({
        isSuccess: false,
        status: 400,
        message: 'Dữ liệu không hợp lệ',
        data: formattedErrors
      })
    }

    next()
  }
}
