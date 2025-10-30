import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../core/users/entities/user.entity';
import { UserRole } from '../../common/enums/user-roles.enum';
import { Program } from '../../core/academic/entities/program.entity';
import { StudyPlan } from '../../core/academic/entities/study-plan.entity';
import { AuditLog } from '../../common/entities/audit-log.entity';
import { Course } from '../../core/academic/entities/course.entity';

@Injectable()
export class CurriculumSeed {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Program) private readonly programRepo: Repository<Program>,
    @InjectRepository(StudyPlan) private readonly studyPlanRepo: Repository<StudyPlan>,
    @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
  ) {}

  async run(): Promise<void> {
    // Ensure a college supervisor exists
    let supervisor = await this.userRepo.findOne({ where: { username: 'swe-supervisor' } });
    if (!supervisor) {
      const hashed = await bcrypt.hash('supervisor123', 12);
      supervisor = this.userRepo.create({
        username: 'swe-supervisor',
        password: hashed,
        firstName: 'SWE',
        lastName: 'Supervisor',
        role: UserRole.COLLEGE_SUPERVISOR,
        isActive: true,
      });
      await this.userRepo.save(supervisor);
    }

    // Create Software Engineering program
    let program = await this.programRepo.findOne({ where: { name: 'Software Engineering' } });
    if (!program) {
      program = this.programRepo.create({ name: 'Software Engineering', version: '2016', notes: 'Imported from college study plan.' });
      await this.programRepo.save(program);
    }

    // Create a basic study plan
    let plan = await this.studyPlanRepo.findOne({ where: { name: 'SWE Study Plan 2016' } });
    if (!plan) {
      plan = this.studyPlanRepo.create({ name: 'SWE Study Plan 2016', departmentId: 'SWE', totalCredits: 160, programId: program.id });
      await this.studyPlanRepo.save(plan);
    }

    // Seed a minimal set of courses to illustrate the scenario
    const ensureCourse = async (code: string, name: string, ch: number) => {
      let c = await this.courseRepo.findOne({ where: { code } });
      if (!c) {
        c = this.courseRepo.create({ code, name, creditHours: ch, hasTheoretical: true });
        await this.courseRepo.save(c);
      }
      return c;
    };
    await ensureCourse('URQ121', 'Arabic Skills (AS)', 2);
    await ensureCourse('URQ220', 'Arabic Civilization (AC)', 2);
    await ensureCourse('SWE111', 'Introduction to Algorithms and Programming (IAP)', 3);

    await this.auditRepo.save(
      this.auditRepo.create({
        actorId: supervisor.id,
        action: 'IMPORT',
        entity: 'programs',
        entityId: program.id,
        diff: { message: 'Supervisor imported Software Engineering study plan from curriculum tables' },
      }),
    );
  }
}


