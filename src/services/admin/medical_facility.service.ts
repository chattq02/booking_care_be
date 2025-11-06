import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateMedicalFacilityDto } from 'src/dtos/medical_facility/create.dto'
import { GetListQueryDto } from 'src/dtos/medical_facility/get_list.dto'
import { UpdateMedicalFacilityDto } from 'src/dtos/medical_facility/update.dto'
import { MedicalFacilityRepository } from 'src/repository/admin/medical_facility.repo'

import { ResultsReturned } from 'src/utils/results-api'

export class MedicalFacilityService {
  private medicalFacilityRepo = new MedicalFacilityRepository()

  // 📋 Lấy danh sách cơ sở y tế (phân trang + tìm kiếm)
  getList = async (query: GetListQueryDto, res: Response) => {
    const { page = 1, per_page = 10, keyword = '' } = query
    const skip = (page - 1) * per_page

    const { data, total } = await this.medicalFacilityRepo.findMany(keyword, Number(skip), Number(per_page))

    const baseUrl = `${process.env.API_BASE_URL}/v1/medical-facility/get-list`

    const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null
    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cơ sở y tế thành công',
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

  // 🟢 Tạo mới cơ sở y tế
  create = async (dto: CreateMedicalFacilityDto, res: Response) => {
    const exists = await this.medicalFacilityRepo.findByName(dto.name)
    if (exists) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tên cơ sở y tế đã tồn tại',
          data: null
        })
      )
    }

    await this.medicalFacilityRepo.create(dto)

    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.CREATED,
        message: 'Tạo cơ sở y tế thành công',
        data: null
      })
    )
  }

  // 🟡 Cập nhật cơ sở y tế
  update = async (id: number, dto: UpdateMedicalFacilityDto, res: Response) => {
    const found = await this.medicalFacilityRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế để cập nhật',
          data: null
        })
      )
    }

    const updated = await this.medicalFacilityRepo.update(id, dto)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Cập nhật cơ sở y tế thành công',
        data: updated
      })
    )
  }

  // 🔴 Xóa cơ sở y tế
  delete = async (id: number, res: Response) => {
    const found = await this.medicalFacilityRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế để xóa',
          data: null
        })
      )
    }

    const count = await this.medicalFacilityRepo.countDepartmentsInFacility(id)
    if (count > 0) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Không thể xóa cơ sở y tế này vì vẫn còn khoa / phòng ban trực thuộc',
          data: null
        })
      )
    }

    await this.medicalFacilityRepo.delete(id)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Xóa cơ sở y tế thành công',
        data: null
      })
    )
  }

  // 📄 Lấy chi tiết cơ sở y tế
  getDetail = async (id: number, res: Response) => {
    const found = await this.medicalFacilityRepo.findById(id)
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

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy chi tiết cơ sở y tế thành công',
        data: found
      })
    )
  }
}
