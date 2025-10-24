import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import user from './user.models'
import course from './course.models'
import course_chapter from './courseChapter.models'

@Table
class course_lesson extends Model {
  @Column({
    type: DataType.STRING(300),
    primaryKey: true
  })
  course_lesson_code!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  course_lesson_name!: string
  @Column({
    type: DataType.TEXT
  })
  course_lesson_link!: string
  @Column({
    type: DataType.INTEGER
  })
  course_lesson_idx_view!: number
  @Column({
    type: DataType.TEXT
  })
  course_lesson_attachment!: string
  @Column({
    type: DataType.TEXT
  })
  course_lesson_nameAttachment!: string
  @Column({
    type: DataType.TEXT
  })
  course_lesson_Remark!: string
  @Column({
    type: DataType.STRING(300)
  })
  course_lesson_LinkVideo!: string
  @Column({
    type: DataType.STRING(300)
  })
  course_lesson_nameVideo!: string
  @Column({
    type: DataType.ENUM('1', '0')
  })
  course_lesson_PublicMode!: string

  @ForeignKey(() => course_chapter)
  @Column
  course_chapter_code!: string

  @BelongsTo(() => course_chapter)
  course_chapter!: course_chapter
}

export default course_lesson
