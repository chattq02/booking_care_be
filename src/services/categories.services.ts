import category from '../models/category.models'
import { useAutoCodeGen } from '../utils/auto-code-gent'

export interface CategoryReqBody {
  CategoryCode?: string
  CategoryName?: string
  CategoryParentCode?: string
  CategoryDesc?: string
  FlagActive?: string
  CreatedBy?: string
  CreatedDate?: string
}

class CategoriesService {
  async create(req: any, user_create: string | undefined) {
    const { autoCodeGen } = useAutoCodeGen()
    const dataCreate: CategoryReqBody = JSON.parse(req)
    dataCreate.CreatedBy = user_create
    dataCreate.CategoryCode = autoCodeGen('CTGRCODE')
    await category.create({
      category_id: dataCreate.CategoryCode,
      category_name: dataCreate.CategoryName,
      category_desc: dataCreate.CategoryDesc,
      category_parent_code: dataCreate.CategoryParentCode,
      category_active: dataCreate.FlagActive,
      category_create_by: dataCreate.CreatedBy
    })

    return null
  }
}

const categoriesService = new CategoriesService()

export default categoriesService
