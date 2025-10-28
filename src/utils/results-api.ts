export class ResultsReturned {
  isSuccess: boolean
  status: number
  message: string
  data: unknown
  constructor({
    isSuccess,
    status,
    message,
    data
  }: {
    isSuccess: boolean
    status: number
    message: string
    data: unknown
  }) {
    this.isSuccess = isSuccess
    this.status = status
    this.message = message
    this.data = data
  }
}
