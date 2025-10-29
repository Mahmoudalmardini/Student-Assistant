import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Course } from './entities/course.entity';
import { Semester } from './entities/semester.entity';

@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Enrollment) private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Semester) private readonly semesterRepo: Repository<Semester>,
  ) {}

  async getStudentEnrollments(userId: string): Promise<Enrollment[]> {
    return this.enrollmentRepo.find({
      where: { userId },
      relations: ['course', 'semester'],
      order: { createdAt: 'ASC' },
    });
  }

  computeSemesterGpas(enrollments: Enrollment[]): Array<{ semesterId: string; semesterName: string; value: number }> {
    const bySemester = new Map<string, { name: string; qualityPoints: number; credits: number }>();
    for (const en of enrollments) {
      const key = en.semesterId;
      const credit = en.course.creditHours;
      const qp = Number(en.gradePoint) * credit;
      if (!bySemester.has(key)) {
        bySemester.set(key, { name: en.semester.name, qualityPoints: 0, credits: 0 });
      }
      const agg = bySemester.get(key)!;
      agg.qualityPoints += qp;
      agg.credits += credit;
    }
    const results: Array<{ semesterId: string; semesterName: string; value: number }> = [];
    for (const [semesterId, agg] of bySemester.entries()) {
      const value = agg.credits ? Number((agg.qualityPoints / agg.credits).toFixed(2)) : 0;
      results.push({ semesterId, semesterName: agg.name, value });
    }
    return results.sort((a, b) => a.semesterName.localeCompare(b.semesterName));
  }

  computeCumulativeGpa(enrollments: Enrollment[]): number {
    let totalQp = 0;
    let totalCredits = 0;
    for (const en of enrollments) {
      const credit = en.course.creditHours;
      totalQp += Number(en.gradePoint) * credit;
      totalCredits += credit;
    }
    return totalCredits ? Number((totalQp / totalCredits).toFixed(2)) : 0;
  }
}


