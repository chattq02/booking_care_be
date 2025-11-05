import { PrismaClient } from '@prisma/client'
import { CreateAcademicTitleDto } from 'src/dtos/academic_title/create_academic_title.dto'
import { UpdateAcademicTitleDto } from 'src/dtos/academic_title/update_academic_title.dto'

const prisma = new PrismaClient()

export class AcademicTitleRepository {
  findAll() {
    return prisma.academicTitle.findMany()
  }

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
      prisma.academicTitle.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.academicTitle.count({ where })
    ])

    return { data, total }
  }

  findById(id: number) {
    return prisma.academicTitle.findUnique({ where: { id } })
  }

  findByName(name: string) {
    return prisma.academicTitle.findUnique({ where: { name } })
  }

  create(data: CreateAcademicTitleDto) {
    return prisma.academicTitle.create({
      data: {
        name: data.name.trim(),
        description: data.description
      }
    })
  }

  update(id: number, data: UpdateAcademicTitleDto) {
    return prisma.academicTitle.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description
      }
    })
  }

  delete(id: number) {
    return prisma.academicTitle.delete({ where: { id } })
  }

  countUsersWithTitle(id: number) {
    return prisma.user.count({ where: { academicTitleId: id } })
  }
}
