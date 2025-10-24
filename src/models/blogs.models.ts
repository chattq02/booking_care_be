import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript'
import user from './user.models' // Giả sử bạn có model User đã định nghĩa trước

@Table
class blog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  blog_id!: number

  @Column({
    type: DataType.STRING(255),
    allowNull: false
  })
  blog_title!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  blog_content!: string

  @Column({
    type: DataType.STRING(255)
  })
  image_url!: string

  @Column({
    type: DataType.STRING(255)
  })
  blog_author!: string

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW
  })
  created_at!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  updated_at!: Date

  // khóa ngoại
  @ForeignKey(() => user)
  @Column({
    type: DataType.STRING(100)
  })
  user_id!: string
  // mối liên hệ với bảng
  @BelongsTo(() => user, { foreignKey: 'user_id' })
  user!: user // tham chiếu đến bảng

  // Thiết lập mối quan hệ với bảng User
  // @ForeignKey(() => user)
  // @Column({
  //   type: DataType.STRING(100),
  //   allowNull: false
  // })
  // user_id!: string

  // @BelongsTo(() => user)
  // user!: user
}

export default blog
