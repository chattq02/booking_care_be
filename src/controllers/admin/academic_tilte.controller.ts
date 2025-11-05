import { Request, Response } from 'express'
import { GetListAcademicTitleQueryDto } from 'src/dtos/academic_title/get_list_academic_title_query.dto'
import { AcademicTitleService } from 'src/services/admin/academic_title.service'

class AcademicTitleController {
  private academicTitleService = new AcademicTitleService()

  // 🟢 Tạo học vị mới
  create = async (req: Request, res: Response) => {
    return this.academicTitleService.create(req.body, res)
  }

  // 🟡 Cập nhật học vị
  update = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.academicTitleService.update(Number(id), req.body, res)
  }

  // 🔴 Xóa học vị (có kiểm tra nếu đã có user thì không cho xóa)
  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.academicTitleService.delete(Number(id), res)
  }

  getListController = async (req: Request, res: Response) => {
    return this.academicTitleService.getListAcademicTitle(req.query as unknown as GetListAcademicTitleQueryDto, res)
  }
}

export const academicTitleController = new AcademicTitleController()
