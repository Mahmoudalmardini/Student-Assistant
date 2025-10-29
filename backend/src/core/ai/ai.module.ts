import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { Course } from '../academic/entities/course.entity';
import { Prerequisite } from '../academic/entities/prerequisite.entity';
import { StudentCourseStatus } from '../academic/entities/student-course-status.entity';
import { ScheduledSection } from '../academic/entities/scheduled-section.entity';
import { PlanningValidator } from '../academic/planning.validator';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Course, Prerequisite, StudentCourseStatus, ScheduledSection]),
  ],
  controllers: [AiController],
  providers: [AiService, PlanningValidator],
  exports: [AiService],
})
export class AiModule {}
