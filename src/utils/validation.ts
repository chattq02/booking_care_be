import express from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { omit } from 'lodash'

import { httpStatus } from '../constants/httpStatus'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { EntityError, ErrorWithStatus } from './Errors'

// can be reused by many routes

interface errorsObjectType {
  message: string
  value: any
  [key: string]: any
}
// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req)
    const errors = validationResult(req)
    // nếu không có lỗi thì next tiếp tục request
    if (errors.isEmpty()) {
      return next()
    }
    const errorsObject = errors.mapped() as unknown as errorsObjectType
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg, value } = errorsObject[key]
      // lỗi không phải do validate

      if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = {
        message: msg,
        value: value
      }
    }

    next(entityError)
  }
}
