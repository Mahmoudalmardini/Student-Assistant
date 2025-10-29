import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from '../../core/academic/entities/semester.entity';
import { Course } from '../../core/academic/entities/course.entity';
import { Enrollment } from '../../core/academic/entities/enrollment.entity';

@Injectable()
export class AcademicSeed {
  constructor(
    @InjectRepository(Semester) private readonly semesterRepo: Repository<Semester>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Enrollment) private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  async run(userId: string) {
    const fall = this.semesterRepo.create({ name: '2024-2025 Fall', startDate: new Date('2024-09-01'), endDate: new Date('2025-01-15') });
    const spring = this.semesterRepo.create({ name: '2024-2025 Spring', startDate: new Date('2025-02-01'), endDate: new Date('2025-06-15') });
    await this.semesterRepo.save([fall, spring]);

    const c1 = this.courseRepo.create({ code: 'MATH101', name: 'Calculus I', creditHours: 3 });
    const c2 = this.courseRepo.create({ code: 'PHY101', name: 'Physics I', creditHours: 4 });
    const c3 = this.courseRepo.create({ code: 'CS101', name: 'Intro to CS', creditHours: 3 });
    await this.courseRepo.save([c1, c2, c3]);

    const e1 = this.enrollmentRepo.create({ userId, courseId: c1.id, semesterId: fall.id, gradeNumeric: 88, gradePoint: 3.7 });
    const e2 = this.enrollmentRepo.create({ userId, courseId: c2.id, semesterId: fall.id, gradeNumeric: 62, gradePoint: 2.0 });
    const e3 = this.enrollmentRepo.create({ userId, courseId: c3.id, semesterId: spring.id, gradeNumeric: 54, gradePoint: 1.3 });
    await this.enrollmentRepo.save([e1, e2, e3]);
  }
}


