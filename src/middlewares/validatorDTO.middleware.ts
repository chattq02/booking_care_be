import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'

export const validateDTO = (DTOClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(DTOClass, req.body)

    const errors = await validate(dtoInstance, {
      whitelist: true, // chỉ giữ lại field có trong DTO
      forbidNonWhitelisted: true // báo lỗi nếu có field thừa
    })

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints
      }))

      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: formattedErrors
      })
    }

    next()
  }
}
