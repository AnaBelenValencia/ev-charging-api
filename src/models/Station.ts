import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Station {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column()
  location!: string

  @Column('float')
  maxCapacityKW!: number

  @Column({ default: 'active' })
  status!: 'active' | 'inactive'

  @Column({ type: 'int', default: 10 })
  autoSwitchMinutes!: number

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
