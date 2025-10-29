import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CollegesService } from './colleges.service';
import { CollegesController } from './colleges.controller';
import { College } from './entities/college.entity';
import { Semester } from './entities/semester.entity';
import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';
import { AcademicService } from './academic.service';

@Module({
  imports: [TypeOrmModule.forFeature([College, Semester, Course, Enrollment])],
  controllers: [CollegesController],
  providers: [CollegesService, AcademicService],
  exports: [CollegesService, AcademicService],
})
export class AcademicModule {}
