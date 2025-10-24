import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'

import course from './course.models'
import user from './user.models'

@Table
class purchased_course extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  declare id: number

  @ForeignKey(() => user)
  @Column
  user_id!: string

  @ForeignKey(() => course)
  @Column
  course_id!: string

  @BelongsTo(() => user)
  user!: user

  @BelongsTo(() => course)
  course!: course
}

export default purchased_course
