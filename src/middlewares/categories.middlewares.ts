import { checkSchema } from 'express-validator'
import category from '../models/category.models'
import { CategoryReqBody } from '../services/categories.services'
import { isNullOrUndefined } from '../utils/CheckCondition'
import { ErrorWithStatus } from '../utils/Errors'
import { validate } from '../utils/validation'

export const categoriesValidator = validate(
  checkSchema(
    {
      strJson: {
        notEmpty: {
          errorMessage: 'Không được để trống'
        },
        in: ['body'],
        custom: {
          options: async (value, { req }) => {
            const dataCategories: CategoryReqBody = JSON.parse(value)
            if (isNullOrUndefined(dataCategories.CategoryName)) {
              throw new ErrorWithStatus({ message: 'Tên danh mục không được để trống', status: 200 })
            }
            if (!isNullOrUndefined(dataCategories.CategoryParentCode)) {
              const categories = await category.findOne({
                where: {
                  category_id: dataCategories.CategoryParentCode
                }
              })
              if (isNullOrUndefined(categories)) {
                throw new ErrorWithStatus({ message: 'Danh mục cha không tồn tại', status: 200 })
              }
              return true
            }

            return true
          }
        }
      }
    },
    ['body']
  )
)
