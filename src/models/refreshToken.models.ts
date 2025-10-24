import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript'
import user from './user.models'

@Table
class refresh_token extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  declare id: number

  @Column({
    type: DataType.STRING(300),
    allowNull: false
  })
  token!: string
  @Column({
    type: DataType.STRING(300)
  })
  create_at!: string

  // khóa ngoại
  @ForeignKey(() => user)
  @Column({
    type: DataType.STRING(100)
  })
  user_id!: string
  // mối liên hệ với bảng
  @BelongsTo(() => user, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  user!: user // tham chiếu đến bảng
}

export default refresh_token
