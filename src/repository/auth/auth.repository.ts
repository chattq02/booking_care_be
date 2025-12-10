import { MedicalFacility, Prisma, Role, Token, TokenType, User } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { YES_NO_FLAG_VALUE, YesNoFlagKey } from 'src/constants/enums'
import { UserStatus } from 'src/constants/user_roles'
import { RegisterDoctorDto } from 'src/dtos/auth/register-doctor.dto'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { UpdateUserDto } from 'src/dtos/auth/update-user.dto'
import { hasPassword } from 'src/utils/crypto'

export class AuthRepository {
  async create(data: RegisterDto): Promise<User> {
    return prisma.user.create({
      data: {
        fullName: data.name,
        email: data.email,
        password: hasPassword(data.password),
        roles: {
          create: data.roles.map((val) => ({
            role: val.role
          })) as Prisma.UserRoleCreateWithoutUserInput[]
        }
      }
    })
  }

  async findByEmail(email: string): Promise<Prisma.UserGetPayload<{
    select: {
      id: true
      uuid: true
      email: true
      fullName: true
      phone: true
      gender: true
      dateOfBirth: true
      address: true
      is_supper_admin: true
      createdAt: true
      updatedAt: true
      is_verify: true
      user_status: true
      password: true
      roles: {
        select: {
          role: true
        }
      }
      facilities: true
    }
  }> | null> {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        uuid: true,
        email: true,
        fullName: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        is_supper_admin: true,
        createdAt: true,
        updatedAt: true,
        is_verify: true,
        user_status: true,
        password: true,
        roles: {
          select: { role: true }
        },
        facilities: true
      }
    })
  }

  async findUserByTokenVerify(
    token: string,
    type: TokenType
  ): Promise<{ user: Pick<User, 'id' | 'uuid' | 'email' | 'is_verify' | 'fullName'>; expiresAt: Date } | null> {
    const tokenRecord = await prisma.token.findFirst({
      where: { token, type },
      select: {
        expiresAt: true,
        user: {
          select: {
            id: true,
            uuid: true,
            email: true,
            fullName: true,
            is_verify: true
          }
        }
      }
    })

    return tokenRecord ?? null
  }

  async findById(id: number, includeFacilities = false): Promise<(User & { facilities?: any[] }) | null> {
    return prisma.user.findUnique({
      where: { id },
      include: includeFacilities ? { facilities: true } : undefined
    })
  }

  async findUserByUuid(user_uuid: string): Promise<
    | (Pick<
        User,
        | 'id'
        | 'uuid'
        | 'email'
        | 'fullName'
        | 'phone'
        | 'gender'
        | 'dateOfBirth'
        | 'address'
        | 'is_supper_admin'
        | 'user_status'
        | 'createdAt'
        | 'updatedAt'
      > & {
        roles: { role: Role }[]
      })
    | null
  > {
    const user = await prisma.user.findUnique({
      where: { uuid: user_uuid },
      select: {
        id: true,
        uuid: true,
        email: true,
        fullName: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        is_supper_admin: true,
        is_update_profile: true,
        user_status: true,
        cccd: true,
        bhyt: true,
        occupation: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: true, // 👈 lấy danh sách role của user
            facility: {
              select: {
                id: true,
                uuid: true,
                code: true,
                name: true,
                imageUrl: true,
                address: true
              }
            }
          }
        },
        academicTitle: {
          select: {
            name: true
          }
        }
      }
    })

    return user ?? null
  }

  async findFacilityByUuid(user_uuid: string): Promise<Pick<User, 'uuid'> | null> {
    const user = await prisma.user.findFirst({
      where: { uuid: user_uuid },
      select: {
        uuid: true,
        avatar: true,
        fullName: true,
        email: true,
        roles: {
          select: {
            role: true, // 👈 lấy danh sách role của user
            facility: {
              select: {
                id: true,
                uuid: true,
                code: true,
                name: true,
                imageUrl: true,
                address: true
              }
            }
          }
        }
      }
    })

    return user ?? null
  }

  async findByEmailIsVerify(user_uuid: string): Promise<YesNoFlagKey | null> {
    const user = await prisma.user.findFirst({
      where: { uuid: user_uuid },
      select: { is_verify: true }
    })
    return user?.is_verify ?? null
  }

  async verifyEmail(user_uuid: string): Promise<Boolean> {
    await prisma.user.update({
      where: { uuid: user_uuid },
      data: { is_verify: YES_NO_FLAG_VALUE['1'], user_status: UserStatus.ACTIVE }
    })
    return true
  }

  async removeTokenByUserUuid(user_uuid: string, type: TokenType) {
    return await prisma.token.deleteMany({
      where: {
        user: {
          uuid: user_uuid
        },
        type
      }
    })
  }

  async removeTokenByRefreshToken(refresh_token: string, type: TokenType) {
    return await prisma.token.deleteMany({
      where: {
        token: refresh_token,
        type
      }
    })
  }

  async updateAndCreateTokenById(data: Pick<Token, 'id' | 'token' | 'type' | 'expiresAt'>) {
    return await prisma.token.upsert({
      where: { userId: data.id }, // 🧩 cần unique index userId
      update: { token: data.token, expiresAt: data.expiresAt },
      create: { userId: data.id, token: data.token, expiresAt: data.expiresAt, type: data.type }
    })
  }

  async updateUserByUuid(uuid: string, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { uuid },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.birthday ? new Date(data.birthday) : undefined,
        address: data.address,
        cccd: data.cccd,
        bhyt: data.healthInsurance,
        nation: data.nation,
        avatar: data.avatar,
        remark: data.remark,
        practice_certificate: data.practice_certificate,
        is_update_profile: 'YES',
        occupation: data.occupation
      }
    })
  }

  /**
   * Tạo bác sĩ mới
   */
  async createDoctor(data: RegisterDoctorDto): Promise<User> {
    return prisma.user.create({
      data: {
        fullName: data.fullName ?? '',
        email: data.email,
        password: hasPassword(data.phone),
        phone: data.phone,
        gender: data.gender,
        cccd: data.cccd,
        avatar: data.avatar,
        address: data.address,
        academicTitleId: data.academicTitleId,
        is_verify: 'YES',
        is_supper_admin: 'NO',
        user_status: 'Active',
        departments: {
          connect: {
            id: data.departmentId
          }
        },
        roles: {
          create: [
            {
              role: Role.DOCTOR,
              facilityId: data.facilityId
            }
          ]
        }
      }
    })
  }
}
