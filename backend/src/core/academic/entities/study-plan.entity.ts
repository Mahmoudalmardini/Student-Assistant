import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { CourseRequirement } from './course-requirement.entity';
import { Program } from './program.entity';

@Entity('study_plans')
export class StudyPlan extends BaseEntity {
  @Column()
  name: string; // e.g., CS 2022 Plan

  @Column()
  departmentId: string;

  @Column({ type: 'integer' })
  totalCredits: number;

  @OneToMany(() => CourseRequirement, (cr) => cr.studyPlan)
  courseRequirements: CourseRequirement[];

  @ManyToOne(() => Program, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'programId' })
  program?: Program;

  @Column({ nullable: true })
  programId?: string;
}


