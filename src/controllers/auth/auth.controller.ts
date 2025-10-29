import { Response, Request } from 'express'
import { AuthService } from 'src/services/auth/auth.service'

class AuthController {
  private authService = new AuthService()

  registerController = async (req: Request, res: Response) => {
    return this.authService.register(req.body, res)
  }

  loginController = async (req: Request, res: Response) => {
    return this.authService.login(req.body, res)
  }

  verifyEmailController = async (req: Request, res: Response) => {
    return this.authService.verifyEmail(req.body, res)
  }
}
const authController = new AuthController()
export default authController
