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

  logoutController = async (req: Request, res: Response) => {
    return this.authService.logout(req.cookies as { refresh_token: string }, res)
  }

  refreshTokenController = async (req: Request, res: Response) => {
    return this.authService.refreshToken(req.cookies as { access_token: string; refresh_token: string }, res)
  }

  forgotPasswordController = async (req: Request, res: Response) => {
    return this.authService.forgotPassword(req.body, res)
  }

  resetPasswordController = async (req: Request, res: Response) => {
    return this.authService.resetPassword(req.body, res)
  }

  meController = async (req: Request, res: Response) => {
    return this.authService.getMe(req.cookies as { access_token: string; refresh_token: string }, res)
  }

  verifyEmailController = async (req: Request, res: Response) => {
    return this.authService.verifyEmail(req.body, res)
  }

  reSendVerifyEmailController = async (req: Request, res: Response) => {
    return this.authService.reSendVerifyEmail(req.body, res)
  }

  getListSelectFacilities = async (req: Request, res: Response) => {
    return this.authService.getListFacility(req.cookies as { access_token: string; refresh_token: string }, res)
  }
}
const authController = new AuthController()
export default authController
