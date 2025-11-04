import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class AcademicTitleRepository {
    findAll() {
        return prisma.academicTitle.findMany()
    }

    async findMany(keyword: string, skip: number, take: number) {
        const where = keyword
            ? { name: { contains: keyword, mode: 'insensitive' as const } }
            : {}

        const [data, total] = await Promise.all([
            prisma.academicTitle.findMany({
                where,
                skip,
                take,
                orderBy: { id: 'asc' },
            }),
            prisma.academicTitle.count({ where }),
        ])

        return { data, total }
    }

    findById(id: number) {
        return prisma.academicTitle.findUnique({ where: { id } })
    }

    findByName(name: string) {
        return prisma.academicTitle.findUnique({ where: { name } })
    }

    create(data: { name: string }) {
        return prisma.academicTitle.create({ data })
    }

    update(id: number, data: { name: string }) {
        return prisma.academicTitle.update({ where: { id }, data })
    }

    delete(id: number) {
        return prisma.academicTitle.delete({ where: { id } })
    }

    countUsersWithTitle(id: number) {
        return prisma.user.count({ where: { academicTitleId: id } })
    }
}
