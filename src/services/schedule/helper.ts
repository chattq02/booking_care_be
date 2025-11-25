export interface SlotTime {
  startTime: string
  endTime: string
  selected: boolean
}

export interface DaySchedule {
  date: string
  dayOfWeek: string
  slots: SlotTime[]
}

export interface SlotConfig {
  id: string
  configName: string
  workStartTime: string
  workEndTime: string
  slotDuration: number
  price: number
  daySchedules: DaySchedule[]
  selectedDates: string[]
}

export const filterSlotsByDate = (slots: SlotConfig[], targetDate: string): SlotConfig[] => {
  const filteredSlots = slots
    .map((slot) => {
      const filteredDaySchedules = slot.daySchedules.filter((day) => day.date === targetDate)

      return {
        ...slot,
        daySchedules: filteredDaySchedules,
        selectedDates: filteredDaySchedules.length > 0 ? [targetDate] : []
      }
    })
    .filter((slot) => slot.daySchedules.length > 0)

  return filteredSlots
}

export const filterSlotsByDateSelected = (slots: SlotConfig[], targetDate: string): SlotConfig[] => {
  const filteredSlots = slots
    .map((slot) => {
      const filteredDaySchedules = slot.daySchedules
        .filter((day) => day.date === targetDate)
        .map((day) => {
          const filteredSlots = day.slots.filter((slot) => slot.selected)
          return {
            ...day,
            slots: filteredSlots
          }
        })

      return {
        ...slot,
        daySchedules: filteredDaySchedules,
        selectedDates: filteredDaySchedules.length > 0 ? [targetDate] : []
      }
    })
    .filter((slot) => slot.daySchedules.length > 0)

  return filteredSlots
}

// Phiên bản nâng cao: Merge và ghi đè các ngày trùng nhau
export const mergeAllSlotsWithOverride = (oldSlots: SlotConfig[], newSlots: SlotConfig[]): SlotConfig[] => {
  const mergedConfig: SlotConfig = {
    id: 'e7445157-f97c-49b5-bb2f-939840f92f42', // Thêm ID mặc định
    configName: 'Cấu hình 1',
    workStartTime: '00:00',
    workEndTime: '07:00',
    slotDuration: 30,
    price: 1000000,
    daySchedules: [],
    selectedDates: []
  }

  // Xác định kiểu dữ liệu cho Map
  const dateMap = new Map<string, DaySchedule>()
  const allSelectedDates = new Set<string>()

  // Xử lý oldSlots trước
  oldSlots.forEach((slot) => {
    slot.daySchedules.forEach((schedule) => {
      dateMap.set(schedule.date, schedule)
      allSelectedDates.add(schedule.date)
    })

    Object.assign(mergedConfig, {
      configName: slot.configName,
      workStartTime: slot.workStartTime,
      workEndTime: slot.workEndTime,
      slotDuration: slot.slotDuration,
      price: slot.price
    })
  })

  // Xử lý newSlots sau (ghi đè các ngày trùng)
  newSlots.forEach((slot) => {
    slot.daySchedules.forEach((schedule) => {
      dateMap.set(schedule.date, schedule) // Ghi đè nếu ngày đã tồn tại
      allSelectedDates.add(schedule.date)
    })

    Object.assign(mergedConfig, {
      configName: slot.configName,
      workStartTime: slot.workStartTime,
      workEndTime: slot.workEndTime,
      slotDuration: slot.slotDuration,
      price: slot.price
    })
  })

  mergedConfig.daySchedules = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date))
  mergedConfig.selectedDates = Array.from(allSelectedDates).sort()

  return [mergedConfig]
}
