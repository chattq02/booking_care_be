import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import user from './user.models'
import cart_user_item from './cartItem.models'

@Table
class cart_user extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true
  })
  cart_id!: string

  @ForeignKey(() => user)
  @Column
  user_id!: string
  @HasMany(() => cart_user_item, { onDelete: 'CASCADE' })
  cart_user_item!: cart_user_item[]

  @BelongsTo(() => user)
  user!: user
}

export default cart_user
