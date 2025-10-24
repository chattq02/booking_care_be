import { httpStatus } from '../constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages-handle/users.messages'

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
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
    super({ message, status: httpStatus.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
