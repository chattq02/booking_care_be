/**
 * Hàm tạo mật khẩu ngẫu nhiên 8 ký tự
 * Đảm bảo có ít nhất:
 * - 1 chữ hoa
 * - 1 chữ thường
 * - 1 số
 * - 1 ký tự đặc biệt
 * @returns {string} Mật khẩu ngẫu nhiên 8 ký tự
 */
export function generateRandomPassword(): string {
  // Các nhóm ký tự
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const specialChars = '@#.'

  // Đảm bảo mỗi loại có ít nhất 1 ký tự
  const getRandomChar = (chars: string): string => {
    return chars[Math.floor(Math.random() * chars.length)]
  }

  // Tạo 4 ký tự đầu tiên từ mỗi nhóm
  const mandatoryChars = [
    getRandomChar(lowercaseChars),
    getRandomChar(uppercaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars)
  ]

  // Tất cả ký tự có thể dùng cho 4 ký tự còn lại
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars

  // Tạo 4 ký tự ngẫu nhiên từ tất cả ký tự
  const randomChars = Array.from({ length: 4 }, () => allChars[Math.floor(Math.random() * allChars.length)])

  // Kết hợp tất cả ký tự và xáo trộn
  const allPasswordChars = [...mandatoryChars, ...randomChars]

  // Xáo trộn mảng để đảm bảo tính ngẫu nhiên
  for (let i = allPasswordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allPasswordChars[i], allPasswordChars[j]] = [allPasswordChars[j], allPasswordChars[i]]
  }

  return allPasswordChars.join('')
}
