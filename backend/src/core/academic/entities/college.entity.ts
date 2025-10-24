import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('colleges')
export class College extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => User, (user) => user.college)
  users: User[];
}
