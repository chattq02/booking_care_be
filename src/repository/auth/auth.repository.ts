import { User } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { YES_NO_FLAG_VALUE, YesNoFlagKey } from 'src/constants/enums'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { hasPassword } from 'src/utils/crypto'

export class AuthRepository {
  async create(data: RegisterDto): Promise<User> {
    return prisma.user.create({
      data: {
        fullName: data.name,
        email: data.email,
        password: hasPassword(data.password),
        role: data.role
      }
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmailIsVerify(email: string): Promise<YesNoFlagKey | null> {
    const user = await prisma.user.findFirst({
      where: { email },
      select: { is_verify: true }
    })
    return user?.is_verify ?? null
  }

  async verifyEmail(email: string): Promise<Boolean> {
    await prisma.user.update({
      where: { email },
      data: { is_verify: YES_NO_FLAG_VALUE['1'] }
    })
    return true
  }
}
