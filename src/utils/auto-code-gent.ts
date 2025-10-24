function generateRandomChars(length: any) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-'
  let randomChars = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    randomChars += chars.charAt(randomIndex)
  }
  return randomChars
}
export const useAutoCodeGen = () => {
  const autoCodeGen = (businessCode: string) => {
    // Lấy ngày và thời gian hiện tại
    const currentDate = new Date()
    const year = currentDate.getFullYear().toString().slice(-2) // Lấy 2 số cuối của năm
    const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Lấy tháng và thêm 0 phía trước nếu cần
    const day = String(currentDate.getDate()).padStart(2, '0') // Lấy ngày và thêm 0 phía trước nếu cần
    const hours = String(currentDate.getHours()).padStart(2, '0') // Lấy giờ và thêm 0 phía trước nếu cần
    const minutes = String(currentDate.getMinutes()).padStart(2, '0') // Lấy phút và thêm 0 phía trước nếu cần
    const seconds = String(currentDate.getSeconds()).padStart(2, '0') // Lấy giây và thêm 0 phía trước nếu cần

    // Tạo chuỗi ký tự ngẫu nhiên có thể chứa ký tự đặc biệt
    const randomChars = generateRandomChars(5)

    // Sắp xếp thời gian và ngày ngẫu nhiên
    const timeArray = [month, day, hours, minutes, seconds, randomChars]
    timeArray.sort(() => Math.random() - 0.5)
    const randomizedTime = timeArray.join('')
    const code = `${year}${seconds}${businessCode}${randomizedTime}`
    return code
  }
  return {
    autoCodeGen
  }
}
