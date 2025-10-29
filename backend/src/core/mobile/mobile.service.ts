import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicService } from '../academic/academic.service';
import { UsersService } from '../users/users.service';
import { BusRegistration } from '../transportation/entities/bus-registration.entity';
import { classifyGpa, getCourseStatus } from '../academic/gpa.util';

@Injectable()
export class MobileService {
  constructor(
    private readonly academicService: AcademicService,
    private readonly usersService: UsersService,
    @InjectRepository(BusRegistration)
    private readonly busRegRepo: Repository<BusRegistration>,
  ) {}

  async getStudentSummary(userId: string) {
    const user = await this.usersService.findOne(userId);
    const enrollments = await this.academicService.getStudentEnrollments(userId);
    const cumulative = this.academicService.computeCumulativeGpa(enrollments);
    const semesters = this.academicService.computeSemesterGpas(enrollments).map((s) => ({
      semesterId: s.semesterId,
      semesterName: s.semesterName,
      value: s.value,
      classification: classifyGpa(s.value),
    }));

    const busRegistered = !!(await this.busRegRepo.findOne({ where: { userId, isActive: true } }));

    const courses = enrollments.map((en) => ({
      courseId: en.courseId,
      code: en.course.code,
      name: en.course.name,
      creditHours: en.course.creditHours,
      semesterId: en.semesterId,
      semesterName: en.semester.name,
      gradeNumeric: en.gradeNumeric,
      gradePoint: Number(en.gradePoint),
      status: getCourseStatus(en.gradeNumeric),
    }));

    return {
      name: `${user.firstName} ${user.lastName}`.trim(),
      busRegistered,
      cumulativeGpa: { value: cumulative, classification: classifyGpa(cumulative) },
      semesterGpas: semesters,
      courses,
    };
  }
}


