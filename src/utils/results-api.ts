export class ResultsReturned {
  isSuccess: boolean
  message: string
  data: unknown
  constructor({ isSuccess, message, data }: { isSuccess: boolean; message: string; data: unknown }) {
    this.isSuccess = isSuccess
    this.message = message
    this.data = data
  }
}
