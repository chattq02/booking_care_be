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
