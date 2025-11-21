import { config } from 'dotenv'
import { Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { DoctorRepository } from 'src/repository/doctor/doctor.repository'
import { ScheduleRepository } from 'src/repository/schedule/schedule.repo'

import { ResultsReturned } from 'src/utils/results-api'
import { filterSlotsByDate, filterSlotsByDateSelected } from '../schedule/helper'

config()

export class DoctorService {
  private doctorRepo = new DoctorRepository()
  private scheduleRepo = new ScheduleRepository()

  getListDoctor = async (query: GetListDoctorQueryDto, res: Response) => {
    const { page, per_page, keyword = '', status = 'All', departmentId, facilityId } = query

    const skip = (Number(page ?? 1) - 1) * Number(per_page ?? 10)

    // Promise.all -> chạy song song để tối ưu hiệu năng
    const { data, total } = await this.doctorRepo.findManyUserType(
      keyword,
      status,
      'Doctor',
      Number(skip),
      Number(per_page),
      facilityId ? Number(facilityId) : undefined,
      departmentId ? Number(departmentId) : undefined
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

  getDoctorById = async (id: string, res: Response) => {
    const doctor = await this.doctorRepo.getDoctorById(Number(id))
    if (!doctor) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy thông tin bác sĩ',
          data: null
        })
      )
    }
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy thông tin thành công',
        data: doctor
      })
    )
  }

  getScheduleDoctorByDate = async (req: Request, res: Response) => {
    const { doctorId, date } = req.query as { doctorId: string; date: string }

    const doctor = await this.doctorRepo.getDoctorById(Number(doctorId))
    if (!doctor) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy thông tin bác sĩ',
          data: null
        })
      )
    }

    const data = await this.scheduleRepo.findScheduleDoctorId(Number(doctorId))

    const slots = data?.slots ? (typeof data.slots === 'string' ? JSON.parse(data.slots) : data.slots) : {}

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy chi tiết lịch theo ngày cho bác sĩ thành công',
        data: filterSlotsByDateSelected(slots, date)
      })
    )
  }
}

const doctorService = new DoctorService()
export default doctorService
