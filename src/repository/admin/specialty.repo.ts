import { PrismaClient } from '@prisma/client'
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
  async findMany(keyword: string, skip: number, take: number) {
    const processedKeyword =
      keyword
        ?.normalize('NFC')
        .replace(/[%_\\]/g, '\\$&') // Escape ký tự đặc biệt SQL LIKE
        .trim() || ''

    const where = processedKeyword
      ? {
          OR: [
            { name: { contains: processedKeyword, mode: 'insensitive' as const } },
            { description: { contains: processedKeyword, mode: 'insensitive' as const } }
          ]
        }
      : {}

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
  findByName(name: string) {
    return prisma.department.findUnique({ where: { name } })
  }

  // 🟢 Tạo mới
  create(data: CreateDepartmentDto) {
    return prisma.department.create({
      data: {
        name: data.name.trim(),
        description: data.description,
        parentId: data.parentId ?? undefined,
        imageUrl: data.imageUrl ?? undefined
      }
    })
  }

  // 🟡 Cập nhật
  update(id: number, data: UpdateDepartmentDto) {
    return prisma.department.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description,
        parentId: data.parentId ?? undefined,
        imageUrl: data.imageUrl ?? ''
      }
    })
  }

  // 🔴 Xóa
  delete(id: number) {
    return prisma.department.delete({ where: { id } })
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
}
