import { Request, Response, NextFunction } from 'express'
import { connectDbSequelize } from '../config/connection-database'

export const checkConnectionDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDbSequelize.authenticate()
    console.log('Connection has been established successfully.')
    await connectDbSequelize.sync({ alter: true })
    console.log('All models were synchronized successfully.')
    next()
  } catch (error) {
    // Nếu không thể kết nối, trả về lỗi
    Object.getOwnPropertyNames(error).forEach((key) => {
      Object.defineProperty(error, key, { enumerable: true })
    })
    return res.status(500).json({
      Success: false,
      data: {
        message: 'Error connecting to database',
        detail: error
      }
    })
  }
}
