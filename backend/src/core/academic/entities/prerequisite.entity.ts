import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Course } from './course.entity';

@Entity('prerequisites')
@Unique(['courseId', 'prereqCourseId'])
export class Prerequisite extends BaseEntity {
  @ManyToOne(() => Course, (c) => c.prerequisites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prereqCourseId' })
  prereqCourse: Course;

  @Column()
  prereqCourseId: string;
}


