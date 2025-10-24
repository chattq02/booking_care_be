import cart_user_item from 'src/models/cartItem.models'
import category from '../models/category.models'
import { useAutoCodeGen } from '../utils/auto-code-gent'
import user from 'src/models/user.models'
import cart_user from 'src/models/cartUser.models'
import course from 'src/models/course.models'

export interface CategoryReqBody {
  CategoryCode?: string
  CategoryName?: string
  CategoryParentCode?: string
  CategoryDesc?: string
  FlagActive?: string
  CreatedBy?: string
  CreatedDate?: string
}

class CartService {
  async create(req: any, user_id: string | undefined) {
    const { autoCodeGen } = useAutoCodeGen()
    const dataUser = await cart_user.findOne({
      where: {
        user_id: user_id?.toUpperCase()
      }
    })
    const dataCourse = await course.findOne({
      where: {
        course_id: req.CourseCode
      }
    })

    await cart_user_item.create({
      cart_item_id: autoCodeGen('CARTITEM'),
      cart_id: dataUser?.dataValues.cart_id,
      course_id: req.CourseCode,
      totalPrice: dataCourse?.dataValues.course_price
    })

    return null
  }
  async getCart(req: any, user_id: string | undefined) {
    const userCart = await user.findOne({
      where: { user_id: user_id?.toUpperCase() },
      attributes: [],
      include: {
        model: cart_user,
        attributes: ['cart_id'],
        include: [
          {
            model: cart_user_item,
            attributes: ['cart_item_id', 'course_id', 'totalPrice'],
            include: [
              {
                model: course,
                attributes: ['course_name', 'course_image', 'course_create_by', 'course_type', 'course_model']
              }
            ] // Thêm bảng course vào include
          }
        ]
      }
    })
    return userCart?.cart
  }
  async delete(req: any, user_id: string | undefined) {
    await cart_user_item.destroy({
      where: {
        cart_item_id: req.cart_item_id // Thay ID bằng mục cần xóa
      }
    })
    return null
  }
}

const cartService = new CartService()

export default cartService
