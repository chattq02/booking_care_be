import { prisma } from 'src/config/database.config'
import { CreatePrescriptionDto } from 'src/dtos/prescription/create.dto'
import { UpdatePrescriptionDto } from 'src/dtos/prescription/update.dto'

export class PrescriptionRepository {
  // ============================
  // LIST
  // ============================
  findMany = async (filter: any) => {
    const where: any = {}
    if (filter.appointmentId) where.appointmentId = filter.appointmentId

    const [data, total] = await Promise.all([
      prisma.prescription.findMany({
        where,
        skip: filter.skip,
        take: filter.take,
        include: {
          items: true
        }
      }),
      prisma.prescription.count({ where })
    ])

    return { data, total }
  }

  // ============================
  // FIND BY ID
  // ============================
  findById = async (id: number) => {
    return prisma.prescription.findUnique({
      where: { id },
      include: { items: true }
    })
  }

  // ============================
  // FIND BY APPOINTMENT
  // ============================
  findByAppointmentId = async (appointmentId: number) => {
    return prisma.prescription.findUnique({
      where: { appointmentId },
      include: { items: true }
    })
  }

  // ============================
  // CREATE
  // ============================
  create = async (dto: CreatePrescriptionDto) => {
    return prisma.prescription.create({
      data: {
        appointmentId: dto.appointmentId,
        diagnosis: dto.diagnosis,
        notes: dto.notes,

        // Create Prescription Items
        items: {
          create: dto.items?.map((item) => ({
            dosage: item.dosage,
            quantity: item.quantity,
            usageInstruction: item.usageInstruction,
            medicineId: item.medicineId,
            medicineName: item.medicineName ?? undefined
          }))
        }
      },
      include: { items: true }
    })
  }

  // ============================
  // UPDATE
  // ============================
  update = async (id: number, dto: UpdatePrescriptionDto) => {
    /**
     * Cơ chế cập nhật:
     * 1. Xoá toàn bộ items cũ (deleteMany)
     * 2. Tạo lại danh sách mới (create)
     * => Giúp tránh sai lệch data hoặc phải viết quá phức tạp
     */

    let itemsUpdate: any = undefined

    if (dto.items) {
      itemsUpdate = {
        deleteMany: {}, // XÓA toàn bộ thuốc cũ
        create: dto.items.map((item) => ({
          medicineName: item.medicineName,
          dosage: item.dosage,
          quantity: item.quantity,
          usageInstruction: item.usageInstruction
        }))
      }
    }

    return prisma.prescription.update({
      where: { id },
      data: {
        diagnosis: dto.diagnosis,
        notes: dto.notes,
        ...(itemsUpdate && { items: itemsUpdate })
      },
      include: { items: true }
    })
  }

  // ============================
  // DELETE
  // ============================
  delete = async (id: number) => {
    return prisma.prescription.delete({
      where: { id }
    })
  }
}
