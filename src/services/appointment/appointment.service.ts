import { config } from 'dotenv'
import { Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateAppointmentDto } from 'src/dtos/appointment/create.dto'
import { AppointmentRepository } from 'src/repository/appointment/appointment.repo'
import { DoctorRepository } from 'src/repository/doctor/doctor.repository'
import { ResultsReturned } from 'src/utils/results-api'

config()

export class AppointmentService {
  private appointmentRepo = new AppointmentRepository()
  private doctorRepo = new DoctorRepository()

  // Tạo cuộc hẹn mới
  createAppointment = async (body: CreateAppointmentDto, res: Response) => {
    const doctor = await this.doctorRepo.getDoctorById(Number(body.doctorId))
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
    const appointment = await this.appointmentRepo.create(body)
    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.CREATED,
        message: 'Tạo cuộc hẹn thành công',
        data: appointment
      })
    )
  }

  // Lấy danh sách cuộc hẹn, có thể filter theo doctorId, patientId, status
  getAppointments = async (query: any, res: Response) => {
    const { doctorId, patientId, status, page = 1, per_page = 10 } = query
    const skip = (Number(page) - 1) * Number(per_page)

    const { data, total } = await this.appointmentRepo.findMany({
      doctorId: doctorId ? Number(doctorId) : undefined,
      patientId: patientId ? Number(patientId) : undefined,
      status,
      skip: Number(skip),
      take: Number(per_page)
    })

    const baseUrl = `${process.env.API_BASE_URL}/v1/appointment/get-appointments`

    const next_page_url =
      Number(skip) + Number(per_page) < total
        ? `${baseUrl}?page=${Number(page) + 1}&per_page=${Number(per_page)}`
        : null
    const prev_page_url = Number(page) > 1 ? `${baseUrl}?page=${Number(page) - 1}&per_page=${Number(per_page)}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cuộc hẹn thành công',
        data: {
          current_page: Number(page),
          data,
          next_page_url,
          prev_page_url,
          path: baseUrl,
          per_page: Number(per_page),
          to: Math.min(Number(skip) + Number(per_page), total),
          total
        }
      })
    )
  }

  // Lấy chi tiết 1 cuộc hẹn theo id
  getAppointmentById = async (id: number, res: Response) => {
    const appointment = await this.appointmentRepo.findById(id)
    if (!appointment) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cuộc hẹn',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy chi tiết cuộc hẹn thành công',
        data: appointment
      })
    )
  }

  // Cập nhật cuộc hẹn
  updateAppointment = async (id: number, body: any, res: Response) => {
    const appointment = await this.appointmentRepo.update(id, body)
    if (!appointment) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cuộc hẹn để cập nhật',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Cập nhật cuộc hẹn thành công',
        data: appointment
      })
    )
  }

  // Xóa cuộc hẹn
  deleteAppointment = async (id: number, res: Response) => {
    const deleted = await this.appointmentRepo.delete(id)
    if (!deleted) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy cuộc hẹn để xóa',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Xóa cuộc hẹn thành công',
        data: deleted
      })
    )
  }

  // Lấy tất cả cuộc hẹn của bác sĩ theo doctorId
  getAppointmentsByDoctor = async (doctorId: number, res: Response) => {
    const appointments = await this.appointmentRepo.findMany({ doctorId })
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cuộc hẹn của bác sĩ thành công',
        data: appointments
      })
    )
  }

  // Lấy tất cả cuộc hẹn của bệnh nhân theo patientId
  getAppointmentsByPatient = async (patientId: number, res: Response) => {
    const appointments = await this.appointmentRepo.findMany({ patientId })
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cuộc hẹn của bệnh nhân thành công',
        data: appointments
      })
    )
  }
}

const appointmentService = new AppointmentService()
export default appointmentService
