import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Enrollment } from './enrollment.entity';
import { SemesterDay } from './semester-day.entity';

@Entity('semesters')
export class Semester extends BaseEntity {
  @Column()
  name: string; // e.g., 2024-2025 Fall

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @OneToMany(() => Enrollment, (en) => en.semester)
  enrollments: Enrollment[];

  @OneToMany(() => SemesterDay, (day) => day.semester)
  days: SemesterDay[];
}


