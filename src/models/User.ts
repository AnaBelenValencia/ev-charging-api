import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

import { UserRole } from '../utils/types';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number

  @Column({ unique: true })
  email!: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STATION_MANAGER,
  })
  role!: UserRole;

  @Column()
  password!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
