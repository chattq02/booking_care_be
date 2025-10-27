import { Response, Request } from 'express'

class AuthController {
  async registerController(req: Request, res: Response) {
    const { name, email, password, role } = req.body

    return res.status(200).json({ status: 'ok' })
  }
}
const authController = new AuthController()
export default authController
