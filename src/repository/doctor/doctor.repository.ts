import { Prisma, User, UserStatus, UserType } from '@prisma/client'
import { prisma } from 'src/config/database.config'

export class DoctorRepository {
  async findManyUserType(
    keyword: string,
    status: UserStatus | 'All',
    user_type: UserType,
    skip = 0,
    take = 100,
    facilityId?: number,
    departmentId?: number
  ): Promise<{
    data: Pick<
      User,
      | 'id'
      | 'uuid'
      | 'email'
      | 'fullName'
      | 'phone'
      | 'gender'
      | 'dateOfBirth'
      | 'address'
      | 'createdAt'
      | 'avatar'
      | 'user_status'
      | 'cccd'
      | 'is_update_profile'
    >[]
    total: number
  }> {
    const normalizeString = (str: string) => str.normalize('NFC').replace(/\s+/g, ' ').trim()
    const normalizedKeyword = normalizeString(keyword || '')

    const where: Prisma.UserWhereInput = {
      user_type,
      AND: [
        keyword
          ? {
              OR: [
                { fullName: { contains: normalizedKeyword, mode: 'insensitive' } },
                { email: { contains: normalizedKeyword, mode: 'insensitive' } },
                { phone: { contains: normalizedKeyword, mode: 'insensitive' } },
                { cccd: { contains: normalizedKeyword, mode: 'insensitive' } }
              ]
            }
          : {},
        status && status !== 'All' ? { user_status: { equals: status as UserStatus } } : {},
        departmentId ? { departments: { some: { id: departmentId } } } : {},
        facilityId ? { facilities: { some: { id: facilityId } } } : {}
      ]
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          uuid: true,
          email: true,
          fullName: true,
          phone: true,
          gender: true,
          dateOfBirth: true,
          address: true,
          createdAt: true,
          avatar: true,
          user_status: true,
          cccd: true,
          is_update_profile: true,
          departments: { select: { id: true, name: true } },
          facilities: { select: { id: true, name: true } },
          academicTitle: true
        }
      }),
      prisma.user.count({ where })
    ])

    return { data, total }
  }

  async getDoctorById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        uuid: true,
        email: true,
        fullName: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        createdAt: true,
        avatar: true,
        user_status: true,
        cccd: true,
        is_update_profile: true,
        departments: { select: { id: true, name: true } },
        facilities: { select: { id: true, name: true, address: true, email: true, phone: true } },
        academicTitle: true,
        description: true
      }
    })
  }

  async searchUsers(keyword: string) {
    return prisma.user.findMany({
      where: {
        fullName: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        uuid: true,
        fullName: true,
        avatar: true,
        user_type: true
      },
      take: 10
    })
  }

  // SEARCH FACILITY
  async searchFacilities(keyword: string) {
    return prisma.medicalFacility.findMany({
      where: {
        name: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        imageUrl: true,
        isActive: true
      },
      take: 10
    })
  }
}
