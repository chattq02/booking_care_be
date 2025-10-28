import { IsVerify, SupperAdmin, User } from '@prisma/client'
import { prisma } from 'src/config/database.config'
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

  async findByEmailVerify(email: string, is_supper_admin: SupperAdmin): Promise<Pick<User, 'is_supper_admin'> | null> {
    return prisma.user.findFirst({
      where: { email, is_supper_admin },
      select: {
        is_supper_admin: true
      }
    })
  }
}
