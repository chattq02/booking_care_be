import { NextFunction, Request, Response } from 'express'
import cartService from 'src/services/cart.services'

class CartController {
  async addToCart(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    await cartService.create(req.body, user_id)

    return res.json({
      isSuccess: true,
      message: 'Thêm vào giỏ hàng thành công!',
      data: null
    })
  }
  async getCartUser(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    const dataCart = await cartService.getCart(req.body, user_id)

    return res.json({
      isSuccess: true,
      message: 'Lấy thông tin giỏ hàng thành công!',
      data: dataCart
    })
  }
  async deleteCourseCart(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    const dataCart = await cartService.delete(req.body, user_id)

    return res.json({
      isSuccess: true,
      message: `Xóa ${req.body.cart_item_id} thành công !`,
      data: dataCart
    })
  }
}
const cartController = new CartController()
export default cartController
