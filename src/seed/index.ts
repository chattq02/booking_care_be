import { prisma } from '../config/database.config'
import { seedAcademicTitle } from './academic_title.seed';
import { seedUsers } from './users.seed'

// import { seedDepartments } from './departments.seed' // nếu có

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...')
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.academicTitle.deleteMany();

  await seedAcademicTitle()

  // await seedUsers() // thêm dần khi có

  console.log('✅ Hoàn tất seed toàn bộ dữ liệu!')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
