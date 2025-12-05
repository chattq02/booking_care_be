import { faker } from '@faker-js/faker/locale/vi'
import { prisma } from 'src/config/database.config'

export const seedMedicines = async () => {
  console.log('🌱 Seeding Medicines...')

  // Lấy danh sách facility có sẵn
  const facilities = await prisma.medicalFacility.findMany({
    select: { id: true }
  })

  if (!facilities.length) {
    console.log('⚠️ Không có medicalFacility nào để tạo medicine.')
    return
  }

  // Danh sách thuốc thật
  const fixedMedicines = [
    'Paracetamol 500mg',
    'Aspirin 81mg',
    'Amoxicillin 500mg',
    'Cefixime 200mg',
    'Azithromycin 250mg',
    'Vitamin C 500mg',
    'Ibuprofen 400mg',
    'Loperamide 2mg',
    'Lansoprazole 30mg',
    'Metformin 500mg',
    'Cetirizine 10mg',
    'Clarithromycin 250mg',
    'Omeprazole 20mg',
    'Hydroxyzine 25mg',
    'Calcium D3'
  ]

  const units = ['viên', 'ống', 'vỉ', 'chai', 'hộp', 'gói']
  const defaultUsages = [
    'Uống sau ăn',
    'Uống trước ăn 30 phút',
    'Ngày 2 lần',
    'Ngày 3 lần',
    'Dùng khi đau hoặc sốt',
    'Theo chỉ định của bác sĩ'
  ]

  // 100 thuốc random
  const generateRandomMedicine = () => ({
    name: `${faker.commerce.productName()} ${faker.number.int({ min: 50, max: 500 })}mg`,
    description: faker.lorem.sentence(),
    unit: faker.helpers.arrayElement(units),
    price: faker.number.float({ min: 5000, max: 150000 }),
    stock: faker.number.int({ min: 0, max: 500 }),
    usage: faker.helpers.arrayElement(defaultUsages),
    manufacturer: faker.company.name()
  })

  // 15 thuốc thật
  const generateFixedMedicine = (name: string) => ({
    name,
    description: faker.lorem.sentence(),
    unit: faker.helpers.arrayElement(units),
    price: faker.number.float({ min: 10000, max: 200000 }),
    stock: faker.number.int({ min: 20, max: 300 }),
    usage: faker.helpers.arrayElement(defaultUsages),
    manufacturer: faker.company.name()
  })

  // 👉 Seed cho từng facility (mỗi facility có 5–20 thuốc bất kỳ từ bộ 115 thuốc)
  const medicines: any[] = []

  for (const facility of facilities) {
    const totalForFacility = faker.number.int({ min: 5, max: 100 })

    // Trộn danh sách thuốc mẫu + thuốc random
    const mergedList = [
      ...fixedMedicines.map(generateFixedMedicine),
      ...Array.from({ length: 100 }).map(generateRandomMedicine)
    ]

    // Chọn ngẫu nhiên N thuốc
    const selectedMedicines = faker.helpers.arrayElements(mergedList, totalForFacility)

    medicines.push(
      ...selectedMedicines.map((m) => ({
        ...m,
        facilityId: facility.id
      }))
    )
  }

  // Insert DB
  await prisma.medicine.createMany({
    data: medicines,
    skipDuplicates: true
  })

  console.log(`✅ Seed hoàn tất! Đã tạo ${medicines.length} thuốc cho ${facilities.length} cơ sở.`)
}
