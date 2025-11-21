import { Prisma, Schedule, ScheduleType } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { CreateScheduleDto } from 'src/dtos/schedule/create.dto'

interface FindManyParams {
  Id: number
  keyword?: string
  type: ScheduleType
  skip?: number
  take?: number
}

export class ScheduleRepository {
  async findMany({
    Id,
    keyword,
    type,
    skip = 0,
    take = 100
  }: FindManyParams): Promise<{ data: Schedule[]; total: number }> {
    // Build điều kiện where dựa theo type
    const where: Prisma.ScheduleWhereInput = {}
    if (type && Id) {
      switch (type) {
        case ScheduleType.DOCTOR:
          where.doctorId = Id
          break
        case ScheduleType.DEPARTMENT:
          where.departmentId = Id
          break
        case ScheduleType.FACILITY:
          where.facilityId = Id
          break
      }
      where.type = type
    }

    const [data, total] = await Promise.all([
      prisma.schedule.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.schedule.count({ where })
    ])

    return { data, total }
  }
  async findById(id: number): Promise<Schedule | null> {
    return prisma.schedule.findUnique({
      where: { id }
    })
  }

  async create(dto: CreateScheduleDto): Promise<Schedule> {
    return prisma.schedule.create({
      data: {
        ...dto,
        slots: JSON.stringify(dto.slots)
      }
    })
  }

  async update(id: number | null, dto: CreateScheduleDto): Promise<Schedule> {
    const safeId = id && id > 0 ? id : -1

    return prisma.schedule.upsert({
      where: { id: safeId },
      update: {
        ...dto,
        slots: JSON.stringify(dto.slots)
      },
      create: {
        ...dto,
        slots: JSON.stringify(dto.slots)
      }
    })
  }

  async deleteMany(id: number) {
    await prisma.schedule.deleteMany({
      where: { doctorId: id }
    })
  }

  async delete(id: number): Promise<Schedule> {
    return prisma.schedule.delete({
      where: { id }
    })
  }
  async findScheduleDoctorId(id: number, departmentId?: number, facilityId?: number): Promise<Schedule | null> {
    return prisma.schedule.findFirst({
      where: {
        doctorId: id,
        ...(departmentId !== undefined && { departmentId }),
        ...(facilityId !== undefined && { facilityId })
      }
      // Không dùng select
    })
  }
}
