import { faker } from '@faker-js/faker/locale/vi'
import { prisma } from 'src/config/database.config'

export const seedMedicalFacilities = async () => {
  console.log('🌱 Seeding Medical Facilities...')

  const facilityNames = [
    'Bệnh viện Bạch Mai',
    'Bệnh viện Chợ Rẫy',
    'Bệnh viện Trung ương Huế',
    'Bệnh viện E Trung ương',
    'Bệnh viện Nhi Trung ương',
    'Bệnh viện Phụ sản Trung ương',
    'Bệnh viện 108',
    'Bệnh viện 103',
    'Bệnh viện Việt Đức',
    'Bệnh viện Đại học Y Dược TP.HCM',
    'Bệnh viện Từ Dũ',
    'Bệnh viện Hòa Hảo',
    'Bệnh viện Quân Y 175',
    'Bệnh viện Ung Bướu TP.HCM',
    'Bệnh viện Vinmec Times City',
    'Bệnh viện Hạnh Phúc',
    'Bệnh viện Hoàn Mỹ Đà Nẵng',
    'Bệnh viện Đa khoa Quốc tế Thu Cúc',
    'Bệnh viện MEDLATEC',
    'Bệnh viện Hữu nghị Việt Tiệp'
  ]

  const provinces = [
    'Hà Nội',
    'TP Hồ Chí Minh',
    'Đà Nẵng',
    'Cần Thơ',
    'Hải Phòng',
    'Thừa Thiên Huế',
    'Bình Dương',
    'Đồng Nai',
    'Bắc Ninh',
    'Quảng Ninh',
    'Nghệ An',
    'Thanh Hóa',
    'Khánh Hòa',
    'Lâm Đồng'
  ]

  const districtsByProvince: Record<string, string[]> = {
    'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Thanh Xuân', 'Hai Bà Trưng', 'Hà Đông'],
    'TP Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Tân Bình', 'Gò Vấp', 'Bình Thạnh', 'Thủ Đức'],
    'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Cẩm Lệ', 'Liên Chiểu'],
    'Cần Thơ': ['Ninh Kiều', 'Cái Răng', 'Bình Thủy', 'Ô Môn'],
    'Hải Phòng': ['Lê Chân', 'Ngô Quyền', 'Hồng Bàng', 'Kiến An'],
    'Thừa Thiên Huế': ['Huế', 'Phú Vang', 'Hương Trà', 'Hương Thủy'],
    'Bình Dương': ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Bến Cát'],
    'Đồng Nai': ['Biên Hòa', 'Long Khánh', 'Trảng Bom', 'Nhơn Trạch'],
    'Bắc Ninh': ['Bắc Ninh', 'Từ Sơn', 'Yên Phong', 'Quế Võ'],
    'Quảng Ninh': ['Hạ Long', 'Cẩm Phả', 'Móng Cái', 'Uông Bí'],
    'Nghệ An': ['Vinh', 'Cửa Lò', 'Nghi Lộc'],
    'Thanh Hóa': ['Thanh Hóa', 'Sầm Sơn', 'Bỉm Sơn'],
    'Khánh Hòa': ['Nha Trang', 'Cam Ranh', 'Diên Khánh'],
    'Lâm Đồng': ['Đà Lạt', 'Bảo Lộc', 'Lâm Hà']
  }

  const wards = [
    'Phường 1',
    'Phường 2',
    'Phường 3',
    'Phường 5',
    'Phường 7',
    'Phường 9',
    'Phường Tân Bình',
    'Phường Trung Tâm'
  ]

  // 👉 Hàm chọn ngẫu nhiên tỉnh / huyện / phường hợp lý
  const randomLocation = () => {
    const province = faker.helpers.arrayElement(provinces)
    const district = faker.helpers.arrayElement(districtsByProvince[province])
    const ward = faker.helpers.arrayElement(wards)
    return { province, district, ward }
  }

  // Fake thêm nhiều cơ sở nhỏ hơn
  const extraFacilities = Array.from({ length: 100 }).map(() => {
    const { province, district, ward } = randomLocation()
    return {
      name: `Phòng khám ${faker.person.lastName()} ${district}`,
      code: faker.string.alphanumeric(6).toUpperCase(),
      address: `${ward}, ${district}, ${province}`,
      phone: '09' + faker.string.numeric(8),
      email: faker.internet.email({ provider: 'benhvien.vn' }),
      description: faker.lorem.sentence(),
      imageUrl: faker.image.urlPicsumPhotos(),
      province,
      district,
      ward
    }
  })

  // Gộp với danh sách chính
  const medicalFacilities = [
    ...facilityNames.map((name) => {
      const { province, district, ward } = randomLocation()
      return {
        name,
        code: faker.string.alphanumeric(6).toUpperCase(),
        address: `${ward}, ${district}, ${province}`,
        phone: '09' + faker.string.numeric(8),
        email: faker.internet.email({ provider: 'benhvien.vn' }),
        description: faker.company.catchPhrase(),
        imageUrl: faker.image.urlPicsumPhotos(),
        province,
        district,
        ward
      }
    }),
    ...extraFacilities
  ]

  await prisma.medicalFacility.createMany({ data: medicalFacilities, skipDuplicates: true })

  console.log(`✅ Đã seed ${medicalFacilities.length} cơ sở y tế thành công!`)
}
