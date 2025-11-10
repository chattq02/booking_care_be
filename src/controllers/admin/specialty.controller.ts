import { Request, Response } from 'express'
import { DeleteDepartmentDto } from 'src/dtos/specialty/delete_department.dto'
import { GetListDepartmentQueryDto } from 'src/dtos/specialty/get-list_department.dto'
import { GetTreeDepartmentByFacilityDto } from 'src/dtos/specialty/get-tree-department.dto'
import { DepartmentService } from 'src/services/admin/specialty.service'

class DepartmentController {
  private departmentService = new DepartmentService()

  // 🟢 Tạo chuyên khoa
  create = async (req: Request, res: Response) => {
    return this.departmentService.create(req.body, res)
  }

  // 🟡 Cập nhật chuyên khoa
  update = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.departmentService.update(Number(id), req.body, res)
  }

  // 🔴 Xóa chuyên khoa
  delete = async (req: Request, res: Response) => {
    const { id, facilityId } = req.params
    return this.departmentService.delete(Number(id), Number(facilityId), res)
  }

  // 📋 Lấy danh sách chuyên khoa
  getList = async (req: Request, res: Response) => {
    return this.departmentService.getListDepartment(req.query as unknown as GetListDepartmentQueryDto, res)
  }

  // 🌳 Lấy cây chuyên khoa
  getTree = async (req: Request, res: Response) => {
    return this.departmentService.getTreeDepartment(req.query as unknown as GetTreeDepartmentByFacilityDto, res)
  }

  // 🌿 Lấy danh sách phòng ban con theo parentId
  getChildren = async (req: Request, res: Response) => {
    const { parentId } = req.params
    return this.departmentService.getChildren(Number(parentId), res)
  }
}

export const departmentController = new DepartmentController()
