import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Semester } from './semester.entity';
import { ScheduledSection } from './scheduled-section.entity';

@Entity('semester_days')
export class SemesterDay extends BaseEntity {
  @ManyToOne(() => Semester, (sem) => sem.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'semesterId' })
  semester: Semester;

  @Column()
  semesterId: string;

  @Column({ type: 'varchar' })
  dayOfWeek: string; // e.g., MON, TUE

  @OneToMany(() => ScheduledSection, (ss) => ss.semesterDay)
  sections: ScheduledSection[];
}


