import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Enrollment } from './enrollment.entity';

@Entity('courses')
export class Course extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'integer' })
  creditHours: number;

  @OneToMany(() => Enrollment, (en) => en.course)
  enrollments: Enrollment[];
}


