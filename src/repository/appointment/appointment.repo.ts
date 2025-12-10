import { Prisma, Appointment, AppointmentStatus, PaymentStatus } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { CreateMedicalRecordDto } from 'src/dtos/appointment/create-medical-record.dto'
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
    facilityId?: number
    patientId?: number
    keyword?: string
    paymentStatus?: PaymentStatus
    status?: AppointmentStatus
    fromDate?: string
    toDate?: string
    skip?: number
    take?: number
  }): Promise<{ data: Appointment[]; total: number }> {
    const { doctorId, patientId, facilityId, status, skip, take, fromDate, toDate, keyword, paymentStatus } = params
    const where: Prisma.AppointmentWhereInput = {}

    if (doctorId) where.doctorId = doctorId
    if (patientId) where.patientId = patientId
    if (status) where.status = status
    if (facilityId) where.facilityId = facilityId

    if (paymentStatus) where.paymentStatus = paymentStatus
    if (fromDate && toDate) {
      where.appointmentDate = {
        gte: fromDate, // "2025-12-01"
        lte: toDate // "2025-12-31"
      }
    }

    if (keyword && keyword.trim() !== '') {
      const processedKeyword = keyword.trim()

      where.OR = [
        // Tìm theo tên bác sĩ
        {
          doctor: {
            fullName: {
              contains: processedKeyword,
              mode: 'insensitive'
            }
          }
        },

        // Tìm theo tên bệnh nhân
        {
          patient: {
            fullName: {
              contains: processedKeyword,
              mode: 'insensitive'
            }
          }
        },

        // SĐT bệnh nhân
        {
          patient: {
            phone: {
              contains: processedKeyword,
              mode: 'insensitive'
            }
          }
        },

        // CCCD bệnh nhân
        {
          patient: {
            cccd: {
              contains: processedKeyword,
              mode: 'insensitive'
            }
          }
        },

        // Tìm theo facility name
        {
          facility: {
            name: {
              contains: processedKeyword,
              mode: 'insensitive'
            }
          }
        },

        // Note
        {
          note: {
            contains: processedKeyword,
            mode: 'insensitive'
          }
        },

        // UUID
        {
          uuid: {
            contains: processedKeyword,
            mode: 'insensitive'
          }
        }
      ]
    }

    const [data, total] = await prisma.$transaction([
      prisma.appointment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'asc' },
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
          remark: true,
          bloodPressure: true,
          temperature: true,
          weight: true,
          height: true,
          medicalHistory: true,
          diagnosis: true,
          conclusion: true,
          heartRate: true,
          instruction: true,
          prescription: {
            select: {
              id: true,
              diagnosis: true,
              notes: true,
              createdAt: true,
              updatedAt: true,
              items: true
            }
          }
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
        ...(status === 'CANCELED' && { remark: remark }),
        ...(status === 'COMPLETED' && { paymentStatus: 'PAID' })
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

  async findCurrentAndNextPatient(params: { doctorId: number; appointmentDate: string }): Promise<Appointment[]> {
    const { doctorId, appointmentDate } = params

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate,
        status: 'CONFIRMED'
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
            avatar: true,
            gender: true,
            cccd: true
          }
        }
      }
    })

    return appointments
  }

  // ===================== LẤY CHI TIẾT BỆNH NHÂN TRONG LỊCH HẸN =====================
  async findPatientDetailInAppointment(appointmentId: number) {
    return prisma.appointment.findFirst({
      where: { id: appointmentId },
      select: {
        id: true,
        uuid: true,
        appointmentDate: true,
        status: true,
        paymentStatus: true,
        paymentAmount: true,
        createdAt: true,
        updatedAt: true,
        slot: true,
        note: true,
        remark: true,
        medicalHistory: true,
        // ===================== BỆNH NHÂN =====================
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            gender: true,
            dateOfBirth: true,
            cccd: true,
            bhyt: true,
            address: true,
            avatar: true,
            occupation: true,
            nation: true
          }
        },

        // ===================== BÁC SĨ =====================
        doctor: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
            experience: true,

            departments: {
              select: {
                id: true,
                name: true
              }
            },

            facilities: {
              select: {
                id: true,
                name: true,
                address: true,
                phone: true,
                email: true
              }
            }
          }
        },

        // ===================== CƠ SỞ Y TẾ =====================
        facility: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true
          }
        },
        prescription: {
          select: {
            id: true,
            diagnosis: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            items: true
          }
        }
      }
    })
  }

  async updateAppointmentMedical(id: number, data: CreateMedicalRecordDto): Promise<Appointment | null> {
    return prisma.$transaction(async (tx) => {
      // 1. Check appointment exists
      const appointment = await tx.appointment.findUnique({
        where: { id }
      })
      if (!appointment) return null

      // 2. Update appointment medical info
      const updatedAppointment = await tx.appointment.update({
        where: { id },
        data: {
          bloodPressure: data.bloodPressure,
          heartRate: data.heartRate,
          weight: data.weight,
          height: data.height,
          temperature: data.temperature,

          diagnosis: data.diagnosis,
          medicalHistory: data.medicalHistory,
          conclusion: data.conclusion,
          instruction: data.instruction,
          status: 'COMPLETED',
          paymentStatus: 'PAID'
        }
      })

      // ==============================
      // 3. PROCESS PRESCRIPTION
      // ==============================
      if (data.prescription) {
        const pres = data.prescription

        // 3.1 Check existing prescription
        const existingPrescription = await tx.prescription.findUnique({
          where: { appointmentId: id }
        })

        let prescriptionId: number

        if (!existingPrescription) {
          // 3.2 Create new prescription
          const newPrescription = await tx.prescription.create({
            data: {
              appointmentId: id,
              diagnosis: pres.diagnosis,
              notes: pres.notes
            }
          })

          prescriptionId = newPrescription.id
        } else {
          // 3.3 Update existing prescription
          const updatedPres = await tx.prescription.update({
            where: { appointmentId: id },
            data: {
              diagnosis: pres.diagnosis,
              notes: pres.notes
            }
          })

          prescriptionId = updatedPres.id

          // 3.4 Delete old items before inserting new ones
          await tx.prescriptionItem.deleteMany({
            where: { prescriptionId }
          })
        }

        // 3.5 Insert new Prescription Items
        if (pres.items?.length) {
          await tx.prescriptionItem.createMany({
            data: pres.items.map((item) => ({
              prescriptionId,
              medicineId: Number(item.medicineId), // ✔ đảm bảo luôn là number
              quantity: Number(item.quantity ?? 1), // ✔ default nếu thiếu
              medicineName: item.name ?? null,
              dosage: item.dosage?.toString() ?? null, // nếu là số -> convert string
              unit: item.unit ?? null,
              frequency: item.frequency ?? null,
              duration: item.duration ?? null,
              mealTime: item.mealTime ?? null,
              instruction: item.instruction ?? null,
              note: item.note ?? null,

              startDate: item.startDate ?? null,
              endDate: item.endDate ?? null
            }))
          })
        }
      }

      return updatedAppointment
    })
  }
}
