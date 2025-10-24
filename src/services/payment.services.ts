import cart_user_item from 'src/models/cartItem.models'
import category from '../models/category.models'
import { useAutoCodeGen } from '../utils/auto-code-gent'
import user from 'src/models/user.models'
import cart_user from 'src/models/cartUser.models'
import course from 'src/models/course.models'
import account_bank from 'src/models/accountBank.models'
import { Op } from 'sequelize'
import { sumBy } from 'lodash'

export interface CategoryReqBody {
  CategoryCode?: string
  CategoryName?: string
  CategoryParentCode?: string
  CategoryDesc?: string
  FlagActive?: string
  CreatedBy?: string
  CreatedDate?: string
}

class PaymentService {
  async create(req: any, user_id: string | undefined) {
    return null
  }
  async getCoursePayment(course_code: any, user_id: string | undefined) {
    const dataBank = await account_bank.findOne({
      where: {
        user_id: user_id?.toUpperCase(),
        flag_active: '1'
      }
    })
    const inforCouse = await course.findOne({
      where: {
        course_id: course_code
      },
      attributes: [
        'course_id',
        'course_price',
        'course_name',
        'course_discount',
        'course_model',
        'course_image',
        'course_type'
      ]
    })
    const linkPayment = `https://img.vietqr.io/image/${`${dataBank?.dataValues.account_bank_code}-${dataBank?.dataValues.account_number}`}-compact.png?amount=${inforCouse?.course_price}&addInfo=${inforCouse?.course_id}`
    return {
      ImagePayment: linkPayment,
      InforCouse: inforCouse
    }
  }
  async getListPayment(req: any, user_id: string | undefined) {
    const dataCoursePayment: any[] = JSON.parse(req) || []
    const cartItemIds = dataCoursePayment.map((item: any) => item.CartItemPayemt)
    const dataBank = await account_bank.findOne({
      where: {
        user_id: user_id?.toUpperCase(),
        flag_active: '1'
      }
    })
    const cartItems = await cart_user_item.findAll({
      attributes: ['cart_item_id', 'course_id', 'quantity', 'totalPrice'],
      where: {
        cart_item_id: {
          [Op.in]: cartItemIds // Điều kiện lọc bằng cách sử dụng Op.in với nhiều giá trị
        }
      },
      include: [
        {
          model: course, // Giả sử bạn có mối quan hệ với model `course`
          attributes: ['course_name', 'course_image', 'course_create_by', 'course_type', 'course_model']
        }
      ]
    })
    const totalPrice = sumBy(cartItems, (item) => item?.totalPrice || 0)
    const nameCourses = cartItems?.map((item) => item.course.course_name).join(', ')
    const linkPayment = `https://img.vietqr.io/image/${`${dataBank?.dataValues.account_bank_code}-${dataBank?.dataValues.account_number}`}-compact.png?amount=${totalPrice}&addInfo=${nameCourses}`
    return {
      ImagePayment: linkPayment,
      cartItems
    }
  }
}

const paymentService = new PaymentService()

export default paymentService
