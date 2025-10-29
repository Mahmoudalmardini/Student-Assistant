import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Course } from './course.entity';
import { CourseStatus } from '../../../common/enums/course-status.enum';

@Entity('student_course_status')
@Unique(['studentId', 'courseId'])
export class StudentCourseStatus extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  studentId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @Column({ type: 'varchar' })
  status: CourseStatus;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  gradePoint?: number; // optional cached GPA points
}


