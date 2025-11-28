import { SlotConfig } from '../schedule/helper'

export const findSlotById = (data: SlotConfig[], slotId: string) => {
  for (const item of data) {
    const daySchedule = item.daySchedules.find((day) => day.slots.some((slot) => slot.id === slotId))

    if (daySchedule) {
      const slot = daySchedule.slots.find((slot) => slot.id === slotId)
      return {
        date: daySchedule.date,
        slot: {
          ...slot,
          isBlock: true
        },
        price: item.price
      }
    }
  }
  return null
}

export const setBlockForSlot = (data: SlotConfig[], targetSlotId: string) => {
  return data.map((item) => {
    // Duyệt qua tất cả các daySchedules
    const updatedDaySchedules = item.daySchedules.map((daySchedule: any) => {
      // Duyệt qua tất cả các slots trong mỗi daySchedule
      const updatedSlots = daySchedule.slots.map((slot: any) => {
        // Nếu slot id khớp với targetSlotId, set isBlock thành true
        if (slot.id === targetSlotId) {
          return {
            ...slot,
            isBlock: true
          }
        }
        return slot
      })

      return {
        ...daySchedule,
        slots: updatedSlots
      }
    })

    return {
      ...item,
      daySchedules: updatedDaySchedules
    }
  })
}
