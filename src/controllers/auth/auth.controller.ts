import { Response, Request } from 'express'
import { AuthService } from 'src/services/auth/auth.service'
import { ResultsReturned } from 'src/utils/results-api'

class AuthController {
  private authService = new AuthService()

  async registerController(req: Request, res: Response) {
    const result = await this.authService.registerUser(req.body)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Register successful',
        data: result
      })
    )
  }
}
const authController = new AuthController()
export default authController
