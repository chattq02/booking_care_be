export const useGetTime = () => {
  const today = new Date()
  const getTimeMoment = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // Tháng 0-11
    const day = String(now.getDate()).padStart(2, '0') // Ngày 1-31
    const hours = String(now.getHours()).padStart(2, '0') // Giờ 0-23
    const minutes = String(now.getMinutes()).padStart(2, '0') // Phút 0-59
    const seconds = String(now.getSeconds()).padStart(2, '0') // Giây 0-59

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
  const convertISO8601Full = (dateTime: string) => {
    const date = new Date(dateTime)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  }
  const getTimeNow = () => {
    function themSoKhong(neuCan: any, so: any) {
      return neuCan && so < 10 ? '0' + so : so
    }
    const now = new Date()

    // Lấy thông tin về năm, tháng, ngày, giờ, phút, giây
    const year = now.getFullYear()
    const month = themSoKhong(true, now.getMonth() + 1) // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    const day = themSoKhong(true, now.getDate())
    const hour = themSoKhong(true, now.getHours())
    const minute = themSoKhong(true, now.getMinutes())
    const second = themSoKhong(true, now.getSeconds())
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }
  return {
    getTimeMoment,
    convertISO8601Full,
    getTimeNow
  }
}
