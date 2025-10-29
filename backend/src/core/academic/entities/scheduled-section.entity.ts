import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Course } from './course.entity';
import { SemesterDay } from './semester-day.entity';
import { SectionType } from './section-type.enum';
import { TimeSlot } from './time-slot.enum';

@Entity('scheduled_sections')
export class ScheduledSection extends BaseEntity {
  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @ManyToOne(() => SemesterDay, (sd) => sd.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'semesterDayId' })
  semesterDay: SemesterDay;

  @Column()
  semesterDayId: string;

  @Column({ type: 'varchar' })
  sectionType: SectionType;

  @Column({ type: 'varchar', array: true })
  slots: TimeSlot[]; // each 2h period; can hold multiple periods per course
}


