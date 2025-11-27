import { Prisma, Appointment, AppointmentStatus } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { UpdateAppointmentDto } from 'src/dtos/appointment/update.dto'

export class AppointmentRepository {
  // Tạo cuộc hẹn mới
  async create(data: any): Promise<Appointment> {
    return prisma.appointment.create({
      data: {
        doctorId: data.doctorId,
        patientId: data.patientId,
        scheduleId: data.scheduleId,
        status: data.status ?? AppointmentStatus.PENDING,
        note: data.note
      }
    })
  }

  // Lấy danh sách cuộc hẹn, có thể filter doctorId, patientId, status, skip/take
  async findMany(params: {
    doctorId?: number
    patientId?: number
    status?: AppointmentStatus
    skip?: number
    take?: number
  }): Promise<{ data: Appointment[]; total: number }> {
    const { doctorId, patientId, status, skip, take } = params

    const where: Prisma.AppointmentWhereInput = {}

    if (doctorId) where.doctorId = doctorId
    if (patientId) where.patientId = patientId
    if (status) where.status = status

    const [data, total] = await prisma.$transaction([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
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
}
