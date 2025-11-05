import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateDepartmentDto } from 'src/dtos/specialty/create_department.dto'
import { GetListDepartmentQueryDto } from 'src/dtos/specialty/get-list_department.dto'
import { UpdateDepartmentDto } from 'src/dtos/specialty/update_department.dto'
import { DepartmentRepository } from 'src/repository/admin/specialty.repo'

import { ResultsReturned } from 'src/utils/results-api'

export class DepartmentService {
  private departmentRepo = new DepartmentRepository()

  // 🟢 Lấy danh sách
  getListDepartment = async (query: GetListDepartmentQueryDto, res: Response) => {
    const { page, per_page, keyword = '' } = query
    const skip = (page - 1) * per_page

    const { data, total } = await this.departmentRepo.findMany(keyword, Number(skip), Number(per_page))

    const baseUrl = `${process.env.API_BASE_URL}/v1/department/get-list`

    const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null
    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách khoa / phòng ban thành công',
        data: {
          current_page: page,
          data,
          next_page_url,
          path: baseUrl,
          per_page,
          prev_page_url,
          to: Math.min(skip + per_page, total),
          total
        }
      })
    )
  }

  // 🟢 Tạo mới
  create = async (dto: CreateDepartmentDto, res: Response) => {
    // 1️⃣ Kiểm tra tên department con đã tồn tại chưa
    const exists = await this.departmentRepo.findByName(dto.name)
    if (exists) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tên khoa / phòng ban đã tồn tại',
          data: null
        })
      )
    }
    // 2️⃣ Nếu DTO có parentName, kiểm tra hoặc tạo parent
    if (dto.parentId) {
      await this.departmentRepo.create({
        name: dto.name,
        description: dto.description,
        parentId: dto.parentId
      })
    } else {
      await this.departmentRepo.create({
        name: dto.name,
        description: dto.description,
        parentId: undefined
      })
    }

    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.CREATED,
        message: 'Tạo khoa / phòng ban thành công',
        data: null
      })
    )
  }

  // 🟡 Cập nhật
  update = async (id: number, dto: UpdateDepartmentDto, res: Response) => {
    const found = await this.departmentRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy khoa / phòng ban để cập nhật',
          data: null
        })
      )
    }

    const updated = await this.departmentRepo.update(id, dto)
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Cập nhật khoa / phòng ban thành công',
        data: updated
      })
    )
  }

  // 🔴 Xóa
  delete = async (id: number, res: Response) => {
    const found = await this.departmentRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy khoa / phòng ban để xóa',
          data: null
        })
      )
    }

    const count = await this.departmentRepo.countUsersInDepartment(id)
    if (count > 0) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Không thể xóa khoa / phòng ban này vì có người dùng đang thuộc về nó',
          data: null
        })
      )
    }

    await this.departmentRepo.delete(id)
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Xóa khoa / phòng ban thành công',
        data: null
      })
    )
  }

  // // 🌳 Lấy cây chuyên khoa cha – con (đệ quy)
  getTreeDepartment = async (res: Response) => {
    const departments = await this.departmentRepo.findAll()

    // nhóm theo parentId
    const map = new Map<number | null, any[]>()
    for (const dept of departments) {
      const key = dept.parentId ?? null
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push({ ...dept, children: [] })
    }

    // đệ quy gán children
    const buildTree = (parentId: number | null): any[] => {
      const children = map.get(parentId) || []
      for (const child of children) {
        child.children = buildTree(child.id)
      }
      return children
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy cây chuyên khoa thành công',
        data: buildTree(null)
      })
    )
  }
}
