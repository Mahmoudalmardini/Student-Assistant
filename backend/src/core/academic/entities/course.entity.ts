import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Enrollment } from './enrollment.entity';
import { CourseType } from './course-type.enum';
import { Prerequisite } from './prerequisite.entity';

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

  @Column({ type: 'varchar', nullable: true })
  type?: CourseType;

  @Column({ type: 'boolean', default: false })
  hasTheoretical: boolean;

  @Column({ type: 'boolean', default: false })
  hasPractical: boolean;

  @Column({ type: 'integer', nullable: true })
  minCreditsToOpen?: number;

  @Column({ type: 'boolean', default: false })
  isConditionRequired: boolean;

  @OneToMany(() => Prerequisite, (p) => p.course)
  prerequisites: Prerequisite[];
}


