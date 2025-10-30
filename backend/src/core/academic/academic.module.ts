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
import { PrereqService } from './prereq.service';
import { Program } from './entities/program.entity';
import { AuditLog } from '../../common/entities/audit-log.entity';
import { ScheduleController } from './schedule.controller';
import { PrereqController } from './prereq.controller';

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
      Program,
      AuditLog,
    ]),
  ],
  controllers: [CollegesController, StudyPlansController, ScheduleController, PrereqController],
  providers: [CollegesService, AcademicService, StudyPlansService, ScheduleService, PrereqService],
  exports: [CollegesService, AcademicService, StudyPlansService, ScheduleService, PrereqService],
})
export class AcademicModule {}
