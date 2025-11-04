import { config } from 'dotenv'
import { Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { DoctorRepository } from 'src/repository/doctor/doctor.repository'
import { ResultsReturned } from 'src/utils/results-api'

config()

export class DoctorService {
  private authRepo = new DoctorRepository()

  getListDoctor = async (query: GetListDoctorQueryDto, res: Response) => {
    const { page, per_page, keyword = '', status = 'All' } = query

    const skip = (page - 1) * per_page

    // Promise.all -> chạy song song để tối ưu hiệu năng
    const { data, total } = await this.authRepo.findManyUserType(
      keyword,
      status,
      'Patient',
      Number(skip),
      Number(per_page)
    )

    const baseUrl = `${process.env.API_BASE_URL}/v1/doctor/get-list-doctor`

    const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null
    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy thông tin thành công',
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
}

const doctorService = new DoctorService()
export default doctorService
