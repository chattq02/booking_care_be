import { MedicalFacilityStatus } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { CreateMedicalFacilityDto } from 'src/dtos/medical_facility/create.dto'
import { UpdateMedicalFacilityDto } from 'src/dtos/medical_facility/update.dto'

export class MedicalFacilityRepository {
  // 🟢 Lấy tất cả (nếu cần cho dropdown)
  findAll() {
    return prisma.medicalFacility.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // 🟢 Lấy danh sách có phân trang + tìm kiếm
  async findMany(keyword: string, skip: number, take: number, isActive: MedicalFacilityStatus | 'All') {
    const processedKeyword =
      keyword
        ?.normalize('NFC')
        .replace(/[%_\\]/g, '\\$&') // Escape ký tự đặc biệt SQL LIKE
        .trim() || ''

    const where = {
      AND: [
        processedKeyword
          ? {
              OR: [
                { name: { contains: processedKeyword, mode: 'insensitive' as const } },
                { address: { contains: processedKeyword, mode: 'insensitive' as const } },
                { description: { contains: processedKeyword, mode: 'insensitive' as const } },
                { code: { contains: processedKeyword, mode: 'insensitive' as const } },
                { email: { contains: processedKeyword, mode: 'insensitive' as const } },
                { phone: { contains: processedKeyword, mode: 'insensitive' as const } }
              ]
            }
          : {},
        isActive && isActive !== 'All' ? { isActive: { equals: isActive } } : {}
      ]
    }

    const [data, total] = await Promise.all([
      prisma.medicalFacility.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.medicalFacility.count({ where })
    ])

    return { data, total }
  }

  // 🟢 Lấy theo id
  findById(id: number) {
    return prisma.medicalFacility.findUnique({ where: { id } })
  }

  // 🟢 Lấy theo tên (check trùng)
  findByName(name: string) {
    return prisma.medicalFacility.findUnique({ where: { name } })
  }

  // 🟢 Tạo mới
  create(data: CreateMedicalFacilityDto) {
    return prisma.medicalFacility.create({
      data: {
        name: data.name.trim(),
        address: data.address?.trim() ?? undefined,
        phone: data.phone?.trim() ?? undefined,
        description: data.description ?? undefined,
        imageUrl: data.imageUrl ?? undefined
      }
    })
  }

  // 🟡 Cập nhật
  update(id: number, data: UpdateMedicalFacilityDto) {
    return prisma.medicalFacility.update({
      where: { id },
      data: {
        name: data.name.trim(),
        address: data.address?.trim() ?? undefined,
        phone: data.phone?.trim() ?? undefined,
        description: data.description ?? undefined,
        imageUrl: data.imageUrl ?? undefined
      }
    })
  }

  // 🔴 Xóa
  delete(id: number) {
    return prisma.medicalFacility.delete({ where: { id } })
  }

  // 🧩 Đếm số khoa / phòng ban trực thuộc (để chặn xóa)
  countDepartmentsInFacility(id: number) {
    return prisma.department.count({
      where: { facilityId: id }
    })
  }

  // 👨‍⚕️ Lấy danh sách user (bác sĩ) thuộc 1 cơ sở y tế (có phân trang + tìm kiếm)
  async findUsersByFacility(facilityId: number, keyword: string, skip: number, take: number) {
    const processedKeyword =
      keyword
        ?.normalize('NFC')
        .replace(/[%_\\]/g, '\\$&')
        .trim() || ''

    const where = {
      AND: [
        {
          facilities: {
            some: { id: facilityId }
          }
        },
        processedKeyword
          ? {
              fullName: {
                contains: processedKeyword,
                mode: 'insensitive' as const
              }
            }
          : {}
      ]
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { fullName: 'asc' },
        select: {
          id: true,
          uuid: true,
          fullName: true,
          email: true,
          phone: true,
          gender: true,
          user_type: true,
          avatar: true,
          experience: true,
          academicTitle: { select: { name: true } },
          departments: { select: { id: true, name: true } }
        }
      }),

      prisma.user.count({ where })
    ])

    return { data, total }
  }
}
