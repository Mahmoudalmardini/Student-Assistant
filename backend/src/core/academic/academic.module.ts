import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollegesService } from './colleges.service';
import { CollegesController } from './colleges.controller';
import { College } from './entities/college.entity';
import { Semester } from './entities/semester.entity';
import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Prerequisite } from './entities/prerequisite.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { CourseRequirement } from './entities/course-requirement.entity';
import { SemesterDay } from './entities/semester-day.entity';
import { ScheduledSection } from './entities/scheduled-section.entity';
import { StudentCourseStatus } from './entities/student-course-status.entity';
import { AcademicService } from './academic.service';
import { StudyPlansService } from './study-plans.service';
import { StudyPlansController } from './study-plans.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      College,
      Semester,
      Course,
      Enrollment,
      Prerequisite,
      StudyPlan,
      CourseRequirement,
      SemesterDay,
      ScheduledSection,
      StudentCourseStatus,
    ]),
  ],
  controllers: [CollegesController, StudyPlansController, ScheduleController],
  providers: [CollegesService, AcademicService, StudyPlansService, ScheduleService],
  exports: [CollegesService, AcademicService, StudyPlansService, ScheduleService],
})
export class AcademicModule {}
