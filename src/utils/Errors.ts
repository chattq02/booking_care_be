import { httpStatusCode } from 'src/constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages-handle/users.messages'

export class ErrorWithStatus {
  messages: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.status = status
    this.messages = message
  }
}

type ErrorType = Record<
  string,
  {
    message: string
    value: any
    [key: string]: any
  }
>
export class EntityError extends ErrorWithStatus {
  errors: ErrorType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: httpStatusCode.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
