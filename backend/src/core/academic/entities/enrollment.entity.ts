import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';
import { Semester } from './semester.entity';

@Entity('enrollments')
export class Enrollment extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  student: User;

  @Column()
  userId: string;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @ManyToOne(() => Semester, (semester) => semester.enrollments)
  @JoinColumn({ name: 'semesterId' })
  semester: Semester;

  @Column()
  semesterId: string;

  @Column({ type: 'integer' })
  gradeNumeric: number; // 0-100

  @Column({ type: 'decimal', precision: 2, scale: 2 })
  gradePoint: number; // 0-4 cached
}


