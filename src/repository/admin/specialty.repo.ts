import { Prisma, PrismaClient } from '@prisma/client'
import { CreateDepartmentDto } from 'src/dtos/specialty/create_department.dto'
import { UpdateDepartmentDto } from 'src/dtos/specialty/update_department.dto'

const prisma = new PrismaClient()

export class DepartmentRepository {
  // 🟢 Lấy tất cả (cho getTree)
  findAll() {
    return prisma.department.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // 🟢 Lấy danh sách có phân trang + tìm kiếm
  async findMany(keyword: string, facilityId: number, skip: number, take: number) {
    const processedKeyword =
      keyword
        ?.normalize('NFC')
        .replace(/[%_\\]/g, '\\$&') // Escape ký tự đặc biệt SQL LIKE
        .trim() || ''

    const where: Prisma.DepartmentWhereInput = {
      facilityId: facilityId,
      ...(processedKeyword && {
        OR: [
          { name: { contains: processedKeyword, mode: 'insensitive' } },
          { description: { contains: processedKeyword, mode: 'insensitive' } }
        ]
      })
    }

    const [data, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.department.count({ where })
    ])

    return { data, total }
  }

  // 🟢 Lấy theo id
  findById(id: number) {
    return prisma.department.findUnique({ where: { id } })
  }

  // 🟢 Lấy theo tên (check trùng)
  findByName(name: string, facilityId: number) {
    return prisma.department.findUnique({
      where: {
        name_facilityId: {
          name,
          facilityId
        }
      }
    })
  }

  // 🟢 Tạo mới
  create(data: CreateDepartmentDto) {
    return prisma.department.create({
      data: {
        name: data.name.trim(),
        description: data.description,
        parentId: data.parentId ?? undefined,
        imageUrl: data.imageUrl ?? undefined,
        facilityId: data.facilityId
      }
    })
  }

  // 🟡 Cập nhật
  update(id: number, data: UpdateDepartmentDto) {
    return prisma.department.update({
      where: { id, facilityId: data.facilityId },
      data: {
        name: data.name.trim(),
        description: data.description,
        parentId: data.parentId ?? undefined,
        imageUrl: data.imageUrl ?? ''
      }
    })
  }

  // 🔴 Xóa
  delete(id: number, facilityId: number) {
    return prisma.department.delete({ where: { id, facilityId } })
  }

  // 🧩 Đếm số user trong khoa (để chặn xóa)
  countUsersInDepartment(id: number) {
    return prisma.user.count({
      where: {
        departments: {
          some: {
            id
          }
        }
      }
    })
  }

  findChildren(parentId: number) {
    return prisma.department.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' }
    })
  }

  findAllByFacilityId = async (facilityId: number) => {
    return prisma.department.findMany({
      where: {
        facilityId: facilityId
      },
      orderBy: { id: 'asc' } // tuỳ chọn
    })
  }

  // Trong DepartmentRepository
  async findUsersInDepartmentPaged(
    departmentId: number,
    facilityId: number,
    keyword: string,
    skip: number,
    take: number
  ) {
    const where: Prisma.UserWhereInput = {
      departments: { some: { id: departmentId } },
      facilities: { some: { id: facilityId } },
      user_status: 'Active' as const,
      OR: [
        { fullName: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } }
      ]
    }

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          user_type: true,
          avatar: true,
          schedules: {
            select: {
              slots: true,
              id: true,
              type: true,
              status: true
            }
          }
        },
        skip,
        take,
        orderBy: { fullName: 'asc' }
      }),
      prisma.user.count({ where })
    ])

    return { data, total }
  }
}
