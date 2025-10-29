import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { StudyPlan } from './study-plan.entity';
import { Course } from './course.entity';

export type RequirementBucket =
  | 'UNIV_MAND'
  | 'UNIV_ELECT'
  | 'COLL_MAND'
  | 'COLL_ELECT'
  | 'DEPT_MAND'
  | 'DEPT_ELECT';

@Entity('course_requirements')
export class CourseRequirement extends BaseEntity {
  @ManyToOne(() => StudyPlan, (sp) => sp.courseRequirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studyPlanId' })
  studyPlan: StudyPlan;

  @Column()
  studyPlanId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  courseId: string;

  @Column({ default: true })
  mandatory: boolean;

  @Column({ type: 'varchar' })
  bucket: RequirementBucket;

  @Column({ type: 'integer', nullable: true })
  minSemesterIndex?: number;
}


