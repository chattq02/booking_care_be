import { config } from 'dotenv'
import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { DoctorRepository } from 'src/repository/doctor/doctor.repository'

import { ResultsReturned } from 'src/utils/results-api'

config()

export class DoctorService {
  private doctorRepo = new DoctorRepository()

  getListDoctor = async (query: GetListDoctorQueryDto, res: Response) => {
    const { page, per_page, keyword = '', status = 'All', departmentId, facilityId } = query

    const skip = (Number(page ?? 1) - 1) * Number(per_page ?? 10)

    // Promise.all -> chạy song song để tối ưu hiệu năng
    const { data, total } = await this.doctorRepo.findManyUserType(
      keyword,
      status,
      'Doctor',
      departmentId ? Number(departmentId) : undefined,
      facilityId ? Number(facilityId) : undefined,
      Number(skip),
      Number(per_page)
    )

    const baseUrl = `${process.env.API_BASE_URL}/v1/doctor/get-list-doctor`

    const next_page_url =
      Number(skip) + Number(per_page) < total
        ? `${baseUrl}?page=${Number(page ?? 1) + 1}&per_page=${Number(per_page)}`
        : null
    const prev_page_url =
      Number(page ?? 1) > 1 ? `${baseUrl}?page=${Number(page ?? 1) - 1}&per_page=${Number(per_page)}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy thông tin thành công',
        data: {
          current_page: Number(page ?? 1),
          data,
          next_page_url,
          path: baseUrl,
          per_page,
          prev_page_url,
          to: Math.min(Number(skip) + Number(per_page), total),
          total
        }
      })
    )
  }
}

const doctorService = new DoctorService()
export default doctorService
