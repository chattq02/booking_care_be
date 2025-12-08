import { config } from 'dotenv'
import { Request, Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateAppointmentDto, ICreateAppointmentReq } from 'src/dtos/appointment/create.dto'
import { AppointmentRepository } from 'src/repository/appointment/appointment.repo'
import { DoctorRepository } from 'src/repository/doctor/doctor.repository'
import { ScheduleRepository } from 'src/repository/schedule/schedule.repo'
import { ResultsReturned } from 'src/utils/results-api'
import { findSlotById, setBlockForSlot } from './helper'
import { AppointmentStatus, PaymentStatus } from '@prisma/client'
import { decryptObject } from 'src/utils/crypto'
import { sendAppointmentConfirmationEmail, sendAppointmentConfirmationStatusEmail } from 'src/utils/email'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { ReportAppointmentDto } from 'src/dtos/appointment/report.dto'

config()

export class AppointmentService {
  private appointmentRepo = new AppointmentRepository()
  private doctorRepo = new DoctorRepository()
  private scheduleRepo = new ScheduleRepository()
  private authRepo = new AuthRepository()

  // Tạo cuộc hẹn mới
  createAppointment = async (body: CreateAppointmentDto, res: Response, req: Request) => {
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

    const scheduleDoctor = await this.scheduleRepo.findScheduleDoctorId(Number(body.doctorId))

    const slots = scheduleDoctor?.slots
      ? typeof scheduleDoctor.slots === 'string'
        ? JSON.parse(scheduleDoctor.slots)
        : scheduleDoctor.slots
      : []

    const slotSelected = findSlotById(slots, body.slotId)
    const infoUser = decryptObject(req.cookies.iu)

    if (!slotSelected) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy thông tin lịch hẹn',
          data: null
        })
      )
    }

    const dataCreate = {
      doctorId: Number(body.doctorId),
      patientId: Number(infoUser?.id),
      scheduleId: Number(scheduleDoctor?.id),
      facilityId: Number(scheduleDoctor?.facilityId), // THÊM facilityId
      status: AppointmentStatus.PENDING,
      note: body.note,
      paymentStatus: PaymentStatus.UNPAID,
      paymentAmount: Number(slotSelected?.price || 0),
      appointmentDate: slotSelected?.date as string,
      slot: slotSelected?.slot
    }

    const patientAlreadyBooked = await this.appointmentRepo.checkPatientAlreadyBooked({
      patientId: Number(infoUser?.id),
      slotId: body.slotId
    })

    if (patientAlreadyBooked) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Bạn đã đặt khung giờ này rồi',
          data: null
        })
      )
    }
    const slotTaken = await this.appointmentRepo.checkSlotTaken({
      doctorId: Number(body.doctorId),
      slotId: body.slotId
    })

    if (slotTaken) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Khung giờ này đã có người đặt',
          data: null
        })
      )
    }

    const dataSchedule = {
      ...scheduleDoctor,
      slots: setBlockForSlot(slots, body.slotId)
    }

    await this.scheduleRepo.update(scheduleDoctor?.id as number, dataSchedule as any, Number(body.doctorId))

    await this.appointmentRepo.create(dataCreate as ICreateAppointmentReq)

    sendAppointmentConfirmationEmail(infoUser.email, {
      customerName: infoUser.name,
      departmentName: doctor.departments.map((item) => item.name).join(', '),
      appointmentDate: slotSelected.date,
      appointmentTime: `${slotSelected.slot.startTime} - ${slotSelected.slot.endTime}`,
      location: doctor.facilities.map((item) => item.name).join(', '),
      staffName: doctor.fullName,
      companyAddress: doctor.facilities.map((item) => item.address)[0] ?? '',
      companyEmail: doctor.facilities.map((item) => item.email)[0] ?? '',
      companyPhone: doctor.facilities.map((item) => item.phone)[0] ?? '',
      companyName: doctor.facilities.map((item) => item.name)[0] ?? ''
    })

    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.CREATED,
        message: 'Tạo cuộc hẹn thành công',
        data: null
      })
    )
  }

  // Lấy danh sách cuộc hẹn, có thể filter theo doctorId, patientId, status
  getAppointments = async (query: any, res: Response) => {
    const { doctorId, patientId, status, page = 1, per_page = 10 } = query
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
  getAppointmentsByDoctor = async (req: Request, res: Response) => {
    const { doctorId, page = 1, per_page = 10, appointmentDate, status } = req.query
    if (doctorId) {
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
    }
    const skip = (Number(page) - 1) * Number(per_page)
    const infoUser = decryptObject(req.cookies.iu)

    const { data, total } = await this.appointmentRepo.findMany({
      doctorId: doctorId ? Number(doctorId) : Number(infoUser.id),
      status: status as AppointmentStatus,
      appointmentDate: appointmentDate as string,
      skip: Number(skip),
      take: Number(per_page)
    })
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cuộc hẹn thành công',
        data: {
          current_page: Number(page),
          data,
          next_page_url: '',
          prev_page_url: '',
          path: '',
          per_page: Number(per_page),
          to: Math.min(Number(skip) + Number(per_page), total),
          total
        }
      })
    )
  }

  // Lấy tất cả cuộc hẹn của bệnh nhân theo patientId
  getAppointmentsByPatient = async (req: Request, res: Response) => {
    const { patientId, page = 1, per_page = 10 } = req.query

    const existing = await this.authRepo.findById(Number(patientId))
    if (!existing) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy thông tin bệnh nhân',
          data: null
        })
      )
    }
    const skip = (Number(page) - 1) * Number(per_page)
    const infoUser = decryptObject(req.cookies.iu)

    const { data, total } = await this.appointmentRepo.findMany({
      patientId: patientId ? Number(patientId) : Number(infoUser.id),
      skip: Number(skip),
      take: Number(per_page)
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách cuộc hẹn thành công',
        data: {
          current_page: Number(page),
          data,
          next_page_url: '',
          prev_page_url: '',
          path: '',
          per_page: Number(per_page),
          to: Math.min(Number(skip) + Number(per_page), total),
          total
        }
      })
    )
  }

  // cập nhật trạng thái cuộc hẹn
  updateStatusAppointment = async (req: Request, res: Response) => {
    const { id } = req.params
    const { status, remark } = req.body

    const appointment = await this.appointmentRepo.findById(Number(id))

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

    const doctor = await this.doctorRepo.getDoctorById(Number(appointment.doctorId))
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

    const infoUser = await this.authRepo.findById(appointment.patientId)

    if (!infoUser) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy thông tin người dùng',
          data: null
        })
      )
    }

    const slotSelected = JSON.parse(appointment.slot as string)

    sendAppointmentConfirmationStatusEmail(infoUser.email, {
      customerName: infoUser.fullName,
      departmentName: doctor.departments.map((item) => item.name).join(', '),
      appointmentDate: appointment.appointmentDate,
      appointmentTime: `${slotSelected.startTime} - ${slotSelected.endTime}`,
      location: doctor.facilities.map((item) => item.name).join(', '),
      staffName: doctor.fullName,
      companyAddress: doctor.facilities.map((item) => item.address)[0] ?? '',
      companyEmail: doctor.facilities.map((item) => item.email)[0] ?? '',
      companyPhone: doctor.facilities.map((item) => item.phone)[0] ?? '',
      companyName: doctor.facilities.map((item) => item.name)[0] ?? '',
      remark: remark,
      status: status
    })

    await this.appointmentRepo.changeStatus({
      id: Number(id),
      status,
      remark
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Thay đổi trạng thái thành công',
        data: null
      })
    )
  }

  // ---------------- REPORT APPOINTMENT WITH DATE VALIDATION (MAX 1 MONTH) ----------------
  reportAppointments = async (req: Request, res: Response) => {
    const { fromDate, toDate, page = 1, per_page = 10 } = req.query as unknown as ReportAppointmentDto

    const iu = req.cookies.iu

    const infoUser = decryptObject(iu)

    const existing = await this.authRepo.findById(Number(infoUser.id))
    if (!existing) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy thông tin bác sĩ',
          data: null
        })
      )
    }

    // Validate fromDate & toDate format
    if (!fromDate || !toDate) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'fromDate và toDate là bắt buộc',
          data: null
        })
      )
    }

    const from = new Date(fromDate as string)
    const to = new Date(toDate as string)

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'fromDate hoặc toDate không đúng định dạng ngày (YYYY-MM-DD)',
          data: null
        })
      )
    }

    // ==============================
    // Validate chỉ được trong 1 tháng
    // ==============================

    // Check khoảng cách 31 ngày
    const diffMs = to.getTime() - from.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays > 31) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Khoảng thời gian chỉ được phép tối đa 31 ngày',
          data: null
        })
      )
    }

    const skip = (Number(page) - 1) * Number(per_page)

    const { total, totalRevenue, totalConfirmedPatients, totalAppointmentCancel, totalAppointmentPending } =
      await this.appointmentRepo.report({
        doctorId: infoUser.id ? Number(infoUser.id) : undefined,
        fromDate: from.toISOString(),
        toDate: to.toISOString()
      })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy báo cáo cuộc hẹn thành công',
        data: {
          total_revenue: totalRevenue,
          total_appointment: total,
          total_patients: totalConfirmedPatients,
          total_appointment_cancel: totalAppointmentCancel,
          total_appointment_pending: totalAppointmentPending
        }
      })
    )
  }
}

const appointmentService = new AppointmentService()
export default appointmentService
