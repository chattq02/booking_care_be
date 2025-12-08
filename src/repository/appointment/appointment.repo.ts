import { Prisma, Appointment, AppointmentStatus, PaymentStatus } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { ICreateAppointmentReq } from 'src/dtos/appointment/create.dto'
import { UpdateAppointmentDto } from 'src/dtos/appointment/update.dto'

export class AppointmentRepository {
  // Tạo cuộc hẹn mới
  async create(data: ICreateAppointmentReq): Promise<Appointment> {
    return prisma.appointment.create({
      data: {
        doctorId: data.doctorId,
        patientId: data.patientId,
        scheduleId: data.scheduleId,
        facilityId: data.facilityId, // THÊM facilityId
        status: data.status ?? AppointmentStatus.PENDING,
        note: data.note,
        paymentStatus: data.paymentStatus ?? PaymentStatus.UNPAID,
        paymentAmount: data.paymentAmount,
        appointmentDate: data.appointmentDate,
        slot: JSON.stringify(data.slot)
      }
    })
  }

  // Lấy danh sách cuộc hẹn, có thể filter doctorId, patientId, status, skip/take
  async findMany(params: {
    doctorId?: number
    patientId?: number
    status?: AppointmentStatus
    appointmentDate?: string
    skip?: number
    take?: number
  }): Promise<{ data: Appointment[]; total: number }> {
    const { doctorId, patientId, status, skip, take, appointmentDate } = params

    const where: Prisma.AppointmentWhereInput = {}

    if (doctorId) where.doctorId = doctorId
    if (patientId) where.patientId = patientId
    if (status) where.status = status
    if (appointmentDate) where.appointmentDate = appointmentDate

    const [data, total] = await prisma.$transaction([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          doctor: {
            select: { id: true, fullName: true, avatar: true }
          },
          status: true,
          appointmentDate: true,
          slot: true,
          patient: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
              phone: true,
              bhyt: true,
              gender: true,
              address: true,
              cccd: true
            }
          },
          note: true,
          createdAt: true,
          updatedAt: true,
          uuid: true,
          facility: {
            select: { id: true, name: true, address: true }
          },
          paymentStatus: true,
          paymentAmount: true,
          doctorId: true,
          patientId: true,
          scheduleId: true,
          attachments: true,
          facilityId: true,
          remark: true
        }
      }),
      prisma.appointment.count({ where })
    ])

    return { data, total }
  }

  // Lấy cuộc hẹn theo ID
  async findById(id: number): Promise<Appointment | null> {
    return prisma.appointment.findUnique({
      where: { id }
    })
  }

  // Cập nhật cuộc hẹn
  async update(id: number, data: UpdateAppointmentDto): Promise<Appointment | null> {
    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) return null

    return prisma.appointment.update({
      where: { id },
      data
    })
  }

  // Xóa cuộc hẹn
  async delete(id: number): Promise<Appointment | null> {
    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) return null

    return prisma.appointment.delete({ where: { id } })
  }

  // Lấy tất cả cuộc hẹn của bác sĩ
  async findByDoctorId(doctorId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Lấy tất cả cuộc hẹn của bệnh nhân
  async findByPatientId(patientId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Hàm check slot đã được đặt
  async checkSlotTaken(params: { doctorId: number; slotId: string }): Promise<boolean> {
    const { doctorId, slotId } = params

    const exists = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
        },
        slot: {
          string_contains: slotId
        }
      }
    })

    return !!exists // true = đã có người đặt
  }

  //Hàm check bệnh nhân đặt lại đúng slot mình đã đặt
  async checkPatientAlreadyBooked(params: { patientId: number; slotId: string }): Promise<boolean> {
    const { patientId, slotId } = params

    const exists = await prisma.appointment.findFirst({
      where: {
        patientId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
        },
        slot: {
          string_contains: slotId
        }
      }
    })

    return !!exists
  }

  // hàm thay đổi trạng thái cuộc hẹn
  async changeStatus(params: { id: number; status: AppointmentStatus; remark: string }) {
    const { id, status, remark } = params

    await prisma.appointment.update({
      where: {
        id
      },
      data: {
        status,
        ...(status === 'CANCELED' && { remark: remark })
      }
    })
  }

  // REPORT APPOINTMENTS + TOTAL REVENUE (PAID ONLY)
  async report(params: { doctorId?: number; fromDate: string; toDate: string }): Promise<{
    total: number
    totalRevenue: number
    totalConfirmedPatients: number
    totalAppointmentCancel: number
    totalAppointmentPending: number
  }> {
    const { doctorId, fromDate, toDate } = params

    const where: Prisma.AppointmentWhereInput = {
      appointmentDate: {
        gte: fromDate,
        lte: toDate
      }
    }

    if (doctorId) where.doctorId = doctorId

    const [total, revenueResult, totalConfirmedPatients, totalAppointmentCancel, totalAppointmentPending] =
      await prisma.$transaction([
        // ================================
        // 2) Tổng Lịch hẹn
        // ================================
        prisma.appointment.count({ where }),

        // ================================
        // 2) Tổng doanh thu (PAID)
        // ================================

        prisma.appointment.aggregate({
          where: {
            ...where,
            paymentStatus: 'PAID'
          },
          _sum: {
            paymentAmount: true
          }
        }),
        // ================================
        // 3) Tổng số bệnh nhân CONFIRMED
        // ================================
        prisma.appointment.count({
          where: {
            ...where,
            status: 'CONFIRMED'
          }
        }),

        // ================================
        // 4) Tổng lịch hẹn bị hủy
        // ================================
        prisma.appointment.count({
          where: {
            ...where,
            status: 'CANCELED'
          }
        }),

        // ================================
        // 4) Tổng lịch hẹn chờ duyệt
        // ================================
        prisma.appointment.count({
          where: {
            ...where,
            status: 'PENDING'
          }
        })
      ])

    const totalRevenue = revenueResult._sum.paymentAmount ?? 0

    return { total, totalRevenue, totalConfirmedPatients, totalAppointmentCancel, totalAppointmentPending }
  }
}
