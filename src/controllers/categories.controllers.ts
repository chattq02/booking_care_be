import { Request, Response } from 'express'
import category from '../models/category.models'
import categoriesService from '../services/categories.services'

export interface CategoryModel {
  category_id?: string
  course_id?: string
  category_name?: string
  category_desc?: string
  catefory_total_course?: string
  category_active?: string
  category_parent_code?: string
  category_create_by?: string
  category_create_at?: string
  category_update_at?: string
}

class CategoryController {
  async categoryCreate(req: Request, res: Response) {
    const { strJson } = req.body
    const user_create: string | undefined = req.decoded_authorization?.user_id

    await categoriesService.create(strJson, user_create)
    return res.json({
      isSuccess: true,
      message: 'Create category successful',
      data: null
    })
  }
  async categoryGetAllActive(req: Request, res: Response) {
    const result = await category.findAll()

    return res.json({
      isSuccess: true,
      message: 'Get category successful',
      data:
        result?.map((val: category) => {
          const {
            category_id,
            category_name,
            category_desc,
            category_total_course,
            category_parent_code,
            category_active,
            category_create_by,
            category_create_at,
            category_update_at
          } = val.dataValues
          return {
            CategoryCode: category_id,
            CategoryName: category_name,
            CategoryDesc: category_desc,
            FlagActive: category_active,
            CategoryParentCode: category_parent_code,
            CreatedBy: category_create_by,
            CreatedDate: category_create_at,
            UpdatedDate: category_update_at
          }
        }) || []
    })
  }
}
const categoryController = new CategoryController()
export default categoryController
