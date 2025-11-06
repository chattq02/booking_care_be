import { prisma } from '../config/database.config'
import { seedAcademicTitle } from './academic_title.seed'
import { seedDepartment } from './departments.seed'
import { seedMedicalFacilities } from './medical_facility.seed'
import { seedUsers } from './users.seed'

// import { seedDepartments } from './departments.seed' // nếu có

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...')
  // await prisma.userRole.deleteMany()
  // await prisma.user.deleteMany()
  // await prisma.academicTitle.deleteMany()
  // await prisma.department.deleteMany()
  // await prisma.medicalFacility.deleteMany()

  await seedMedicalFacilities()
  await seedDepartment()
  // await seedAcademicTitle()
  // await seedUsers()

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
