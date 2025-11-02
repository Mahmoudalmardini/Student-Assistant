import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { SuperAdminSeeder } from './database/seeders/super-admin.seeder';
import { User } from './core/users/entities/user.entity';
import { College } from './core/academic/entities/college.entity';
import { Bus } from './core/transportation/entities/bus.entity';
import { Route } from './core/transportation/entities/route.entity';
import { BusRoute } from './core/transportation/entities/bus-route.entity';
import { BusLocation } from './core/tracking/entities/bus-location.entity';
import { BusRegistration } from './core/transportation/entities/bus-registration.entity';
import { Semester } from './core/academic/entities/semester.entity';
import { Course } from './core/academic/entities/course.entity';
import { Enrollment } from './core/academic/entities/enrollment.entity';
import { AcademicModule } from './core/academic/academic.module';
import { AiModule } from './core/ai/ai.module';
import { Prerequisite } from './core/academic/entities/prerequisite.entity';
import { StudyPlan } from './core/academic/entities/study-plan.entity';
import { CourseRequirement } from './core/academic/entities/course-requirement.entity';
import { SemesterDay } from './core/academic/entities/semester-day.entity';
import { ScheduledSection } from './core/academic/entities/scheduled-section.entity';
import { StudentCourseStatus } from './core/academic/entities/student-course-status.entity';
import { TransportationModule } from './core/transportation/transportation.module';
import { MobileModule } from './core/mobile/mobile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5434'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'student_assistant',
      entities: [
        User,
        College,
        Bus,
        Route,
        BusRoute,
        BusLocation,
        BusRegistration,
        Semester,
        Course,
        Enrollment,
        Prerequisite,
        StudyPlan,
        CourseRequirement,
        SemesterDay,
        ScheduledSection,
        StudentCourseStatus,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    AcademicModule,
    TransportationModule,
    AiModule,
    MobileModule,
  ],
  controllers: [AppController],
  providers: [AppService, SuperAdminSeeder],
})
export class AppModule {}
