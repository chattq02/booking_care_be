import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateMedicalFacilityDto } from 'src/dtos/medical_facility/create.dto'
import { GetListQueryDto } from 'src/dtos/medical_facility/get_list.dto'
import { UpdateMedicalFacilityDto } from 'src/dtos/medical_facility/update.dto'
import { MedicalFacilityRepository } from 'src/repository/admin/medical_facility.repo'
import { buildWhereMedicalFacility } from 'src/utils/query-scopes/buildWhereMedicalFacility'

import { ResultsReturned } from 'src/utils/results-api'

export class MedicalFacilityService {
  private medicalFacilityRepo = new MedicalFacilityRepository()

  // 📋 Lấy danh sách cơ sở y tế (phân trang + tìm kiếm)
  getList = async (req: Request, res: Response) => {
    const { page = 1, per_page = 10, keyword = '', status = 'All' } = req.query as unknown as GetListQueryDto

    const skip = (Number(page) - 1) * Number(per_page)

    const processedKeyword =
      keyword
        ?.normalize('NFC')
        .replace(/[%_\\]/g, '\\$&') // Escape ký tự đặc biệt SQL LIKE
        .trim() || ''

    const where: Prisma.MedicalFacilityWhereInput = {
      AND: [
        processedKeyword
          ? {
              OR: [
                { name: { contains: processedKeyword, mode: 'insensitive' as const } },
                { address: { contains: processedKeyword, mode: 'insensitive' as const } },
                { description: { contains: processedKeyword, mode: 'insensitive' as const } },
                { code: { contains: processedKeyword, mode: 'insensitive' as const } },
                { email: { contains: processedKeyword, mode: 'insensitive' as const } },
                { phone: { contains: processedKeyword, mode: 'insensitive' as const } }
              ]
            }
          : {},
        status && status !== 'All' ? { isActive: { equals: status } } : {}
      ]
    }

    const { data, total } = await this.medicalFacilityRepo.findMany(
      buildWhereMedicalFacility(req, where),
      Number(skip),
      Number(per_page)
    )

    const baseUrl = `${process.env.API_BASE_URL}/v1/medical-facility/get-list`

    const next_page_url =
      Number(skip) + Number(per_page) < total ? `${baseUrl}?page=${Number(page) + 1}&per_page=${per_page}` : null
    const prev_page_url = Number(page) > 1 ? `${baseUrl}?page=${Number(page) - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cơ sở y tế thành công',
        data: {
          current_page: Number(page),
          data,
          next_page_url,
          path: baseUrl,
          per_page,
          prev_page_url,
          to: Math.min(skip + Number(per_page), total),
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

  // 👨‍⚕️ Lấy danh sách user (bác sĩ) thuộc 1 cơ sở y tế (có phân trang + tìm kiếm)
  getUsersByFacility = async (id: number, res: Response) => {
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

    // 👉 Lấy query params từ request
    const {
      page = 1,
      per_page = 10,
      keyword = ''
    } = res.req.query as {
      page?: string
      per_page?: string
      keyword?: string
    }

    const skip = (Number(page) - 1) * Number(per_page)

    const { data, total } = await this.medicalFacilityRepo.findUsersByFacility(id, keyword, skip, Number(per_page))

    const baseUrl = `${process.env.API_BASE_URL}/v1/medical-facility/${id}/users`

    const next_page_url =
      skip + Number(per_page) < total ? `${baseUrl}?page=${Number(page) + 1}&per_page=${per_page}` : null
    const prev_page_url = Number(page) > 1 ? `${baseUrl}?page=${Number(page) - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách người dùng trong cơ sở y tế thành công',
        data: {
          current_page: Number(page),
          data,
          next_page_url,
          path: baseUrl,
          per_page: Number(per_page),
          prev_page_url,
          to: Math.min(skip + Number(per_page), total),
          total
        }
      })
    )
  }
}
