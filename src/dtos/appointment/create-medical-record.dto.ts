import { IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateMedicalRecordDto {
  @IsNumber({}, { message: 'appointmentId phải là số' })
  appointmentId!: string

  // ===== VITAL SIGNS =====

  @IsString({ message: 'bloodPressure phải là chuỗi' })
  bloodPressure!: string // "120/80"

  @IsNumber({}, { message: 'heartRate phải là số' })
  heartRate!: number

  @IsNumber({}, { message: 'weight phải là số' })
  weight!: number

  @IsNumber({}, { message: 'height phải là số' })
  height!: number

  @IsNumber({}, { message: 'temperature phải là số' })
  temperature!: number

  @IsString({ message: 'diagnosis phải là chuỗi' })
  diagnosis!: string

  @IsOptional()
  @IsString({ message: 'medicalHistory phải là chuỗi' })
  medicalHistory?: string

  @IsOptional()
  @IsString({ message: 'conclusion phải là chuỗi' })
  conclusion?: string

  @IsOptional()
  @IsString({ message: 'instruction phải là chuỗi' })
  instruction?: string

  // ===== PRESCRIPTION (OPTIONAL) =====
  @IsOptional()
  prescription?: {
    diagnosis?: string
    notes?: string
    items?: {
      medicineId?: number
      name?: string
      dosage?: number
      quantity?: number
      frequency?: string
      duration?: string
      mealTime?: string
      startDate?: string
      endDate?: string
      instruction?: string
      note?: string
      unit?: string
    }[]
  }
}
