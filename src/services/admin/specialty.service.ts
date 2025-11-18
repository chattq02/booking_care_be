import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateDepartmentDto } from 'src/dtos/specialty/create_department.dto'
import { DeleteDepartmentDto } from 'src/dtos/specialty/delete_department.dto'
import { GetListDepartmentQueryDto } from 'src/dtos/specialty/get-list_department.dto'
import { GetTreeDepartmentByFacilityDto } from 'src/dtos/specialty/get-tree-department.dto'
import { GetListUserDepartmentQueryDto } from 'src/dtos/specialty/get-user'
import { UpdateDepartmentDto } from 'src/dtos/specialty/update_department.dto'
import { MedicalFacilityRepository } from 'src/repository/admin/medical_facility.repo'
import { DepartmentRepository } from 'src/repository/admin/specialty.repo'

import { ResultsReturned } from 'src/utils/results-api'
import { SlotConfig } from '../schedule/helper'

export class DepartmentService {
  private departmentRepo = new DepartmentRepository()

  private medicalFacilityRepo = new MedicalFacilityRepository()

  // 🟢 Lấy danh sách
  getListDepartment = async (query: GetListDepartmentQueryDto, res: Response) => {
    const { page, per_page, keyword = '', facilityId } = query
    const skip = (page - 1) * per_page

    const { data, total } = await this.departmentRepo.findMany(
      keyword,
      Number(facilityId),
      Number(skip),
      Number(per_page)
    )

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
    const found = await this.medicalFacilityRepo.findById(Number(dto.facilityId))
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế ',
          data: null
        })
      )
    }
    // 1️⃣ Kiểm tra tên department con đã tồn tại chưa
    const exists = await this.departmentRepo.findByName(dto.name, dto.facilityId)
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
        ...dto,
        parentId: dto.parentId
      })
    } else {
      await this.departmentRepo.create({
        ...dto,
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
    const isFacilityId = await this.medicalFacilityRepo.findById(Number(dto.facilityId))
    if (!isFacilityId) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế ',
          data: null
        })
      )
    }
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

    if (id === dto.parentId) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Không thể cập nhật khoa / phòng ban con bằng chính nó',
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
  delete = async (id: number, facilityId: number, res: Response) => {
    const isFacilityId = await this.medicalFacilityRepo.findById(Number(facilityId))
    if (!isFacilityId) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế ',
          data: null
        })
      )
    }
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
    await this.departmentRepo.delete(id, facilityId)
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
  getTreeDepartment = async (dto: GetTreeDepartmentByFacilityDto, res: Response) => {
    const found = await this.medicalFacilityRepo.findById(Number(dto.facilityId))
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế',
          data: null
        })
      )
    }

    // Lấy department theo facility
    const departments = await this.departmentRepo.findAllByFacilityId(Number(dto.facilityId))

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
        message: 'Lấy chuyên khoa thành công',
        data: buildTree(null)
      })
    )
  }

  getChildren = async (parentId: number, res: Response) => {
    const found = await this.departmentRepo.findById(parentId)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy khoa / phòng ban',
          data: null
        })
      )
    }
    const children = await this.departmentRepo.findChildren(parentId)
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy chuyên khoa thành công',
        data: children
      })
    )
  }

  // 👥 Lấy danh sách user theo department và facility
  getUsersByDepartment = async (query: GetListUserDepartmentQueryDto, departmentId: number, res: Response) => {
    const { page, per_page, keyword = '', facilityId } = query as unknown as GetListUserDepartmentQueryDto
    const skip = Number((Number(page) - 1) * Number(per_page))

    // 1️⃣ Kiểm tra cơ sở y tế
    const facility = await this.medicalFacilityRepo.findById(Number(facilityId))
    if (!facility) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        isSuccess: false,
        status: httpStatusCode.NOT_FOUND,
        message: 'Không tìm thấy cơ sở y tế',
        data: null
      })
    }

    // 2️⃣ Kiểm tra phòng ban
    const department = await this.departmentRepo.findById(Number(departmentId))
    if (!department || Number(department.facilityId) !== Number(facilityId)) {
      return res.status(httpStatusCode.NOT_FOUND).json({
        isSuccess: false,
        status: httpStatusCode.NOT_FOUND,
        message: 'Không tìm thấy khoa / phòng ban thuộc cơ sở này',
        data: null
      })
    }

    // 3️⃣ Lấy dữ liệu user với phân trang
    const { data, total } = await this.departmentRepo.findUsersInDepartmentPaged(
      Number(departmentId),
      Number(facilityId),
      keyword,
      skip,
      Number(per_page)
    )

    // Lấy ngày hôm nay (không bao gồm thời gian)
    const todayStr = new Date().toISOString().split('T')[0]

    const baseUrl = `${process.env.API_BASE_URL}/v1/department/${departmentId}/facility/${facilityId}/users`
    const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null
    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json({
      isSuccess: true,
      status: httpStatusCode.OK,
      message: 'Lấy danh sách người dùng thành công',
      data: {
        current_page: Number(page),
        data: data.map((user) => ({
          ...user,
          schedules: user.schedules
            .map((schedule) => {
              const slots: SlotConfig[] =
                typeof schedule.slots === 'string' ? JSON.parse(schedule.slots) : schedule.slots
              const filteredSlots = slots
                .map((slot) => {
                  // Chỉ giữ lại các daySchedules từ hôm nay trở đi
                  const daySchedules = (slot.daySchedules || []).filter((day) => day.date >= todayStr)
                  return daySchedules.length > 0
                    ? {
                        ...slot,
                        daySchedules,
                        selectedDates: (slot.selectedDates || []).filter((date) => date >= todayStr)
                      }
                    : null
                })
                .filter(Boolean)
              return filteredSlots.length > 0 ? { ...schedule, slots: filteredSlots } : null
            })
            .filter(Boolean)
        })),
        next_page_url,
        prev_page_url,
        path: baseUrl,
        per_page,
        to: Math.min(skip + Number(per_page), total),
        total
      }
    })
  }
}
