import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateScheduleDto } from 'src/dtos/schedule/create.dto'
import { GetListScheduleQueryDto } from 'src/dtos/schedule/get-list.dto'
import { UpdateScheduleDto } from 'src/dtos/schedule/update.dto'
import { MedicalFacilityRepository } from 'src/repository/admin/medical_facility.repo'
import { DepartmentRepository } from 'src/repository/admin/specialty.repo'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { ScheduleRepository } from 'src/repository/schedule/schedule.repo'
import { ResultsReturned } from 'src/utils/results-api'

export class ScheduleService {
  private scheduleRepo = new ScheduleRepository()
  private userRepo = new AuthRepository()
  private facilityRepo = new MedicalFacilityRepository()
  private departmentRepo = new DepartmentRepository()

  // 🟢 Lấy danh sách lịch
  getListSchedule = async (query: GetListScheduleQueryDto, res: Response) => {
    const { page = 1, per_page = 20, Id, type } = query
    const skip = (page - 1) * per_page

    const { data, total } = await this.scheduleRepo.findMany({
      Id: Number(Id),
      type,
      skip,
      take: Number(per_page)
    })

    const baseUrl = `${process.env.API_BASE_URL}/v1/schedule`
    const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null
    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách lịch thành công',
        data: {
          current_page: page,
          data: data.map((item) => {
            return {
              ...item,
              slots: item.slots ? (typeof item.slots === 'string' ? JSON.parse(item.slots) : item.slots) : {}
            }
          }),
          next_page_url,
          prev_page_url,
          path: baseUrl,
          per_page,
          to: Math.min(skip + per_page, total),
          total
        }
      })
    )
  }

  // 🟢 Lấy lịch theo bác sĩ
  getSchedulesByDoctor = async (doctorId: number, query: GetListScheduleQueryDto, res: Response) => {
    const { page = 1, per_page = 20 } = query
    const skip = (page - 1) * per_page

    const doctor = await this.userRepo.findById(doctorId)
    if (!doctor) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy bác sĩ',
          data: null
        })
      )
    }

    const { data, total } = await this.scheduleRepo.findMany({ Id: doctorId, type: 'DOCTOR', skip, take: per_page })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy lịch bác sĩ thành công',
        data: { current_page: page, data, total }
      })
    )
  }

  // 🟢 Lấy lịch theo cơ sở y tế
  getSchedulesByFacility = async (facilityId: number, query: GetListScheduleQueryDto, res: Response) => {
    const { page = 1, per_page = 20 } = query
    const skip = (page - 1) * per_page

    const facility = await this.facilityRepo.findById(facilityId)
    if (!facility) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cơ sở y tế',
          data: null
        })
      )
    }

    const { data, total } = await this.scheduleRepo.findMany({ Id: facilityId, type: 'FACILITY', skip, take: per_page })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy lịch cơ sở thành công',
        data: { current_page: page, data, total }
      })
    )
  }

  // 🟢 Lấy chi tiết lịch
  getScheduleById = async (id: number, res: Response) => {
    const schedule = await this.scheduleRepo.findById(id)
    if (!schedule) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy lịch',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy chi tiết lịch thành công',
        data: schedule
      })
    )
  }

  // Tạo lịch
  createSchedule = async (dto: CreateScheduleDto, res: Response) => {
    // Kiểm tra bác sĩ
    if (dto.doctorId) {
      const doctor = await this.userRepo.findById(dto.doctorId, true)
      if (!doctor)
        return res.status(httpStatusCode.NOT_FOUND).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.NOT_FOUND,
            message: 'Không tìm thấy bác sĩ',
            data: null
          })
        )
      if (dto.facilityId && !doctor.facilities?.some((f) => f.id === dto.facilityId))
        return res.status(httpStatusCode.BAD_REQUEST).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.BAD_REQUEST,
            message: 'Bác sĩ không thuộc cơ sở y tế',
            data: null
          })
        )
    }

    // Kiểm tra cơ sở y tế
    if (dto.facilityId) {
      const facility = await this.facilityRepo.findById(dto.facilityId)
      if (!facility)
        return res.status(httpStatusCode.NOT_FOUND).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.NOT_FOUND,
            message: 'Không tìm thấy cơ sở y tế',
            data: null
          })
        )
    }

    // Kiểm tra phòng ban
    if (dto.departmentId) {
      const department = await this.departmentRepo.findById(dto.departmentId)
      if (!department)
        return res.status(httpStatusCode.NOT_FOUND).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.NOT_FOUND,
            message: 'Không tìm thấy phòng ban',
            data: null
          })
        )
      if (dto.facilityId && department.facilityId !== dto.facilityId)
        return res.status(httpStatusCode.BAD_REQUEST).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.BAD_REQUEST,
            message: 'Phòng ban không thuộc cơ sở y tế',
            data: null
          })
        )
    }

    // Tạo lịch
    const created = await this.scheduleRepo.create(dto)

    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.CREATED,
        message: 'Tạo lịch thành công',
        data: created
      })
    )
  }

  // Cập nhật lịch
  updateSchedule = async (id: number, dto: UpdateScheduleDto, res: Response) => {
    const found = await this.scheduleRepo.findById(id)
    if (!found)
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy lịch để cập nhật',
          data: null
        })
      )

    const updated = await this.scheduleRepo.update(id, dto)
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Cập nhật lịch thành công',
        data: updated
      })
    )
  }

  // Xóa lịch
  deleteSchedule = async (id: number, res: Response) => {
    const found = await this.scheduleRepo.findById(id)
    if (!found)
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy lịch để xóa',
          data: null
        })
      )

    await this.scheduleRepo.delete(id)
    return res
      .status(httpStatusCode.OK)
      .json(
        new ResultsReturned({ isSuccess: true, status: httpStatusCode.OK, message: 'Xóa lịch thành công', data: null })
      )
  }
}
