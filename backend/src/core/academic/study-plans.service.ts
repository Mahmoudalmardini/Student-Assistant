import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';
import { CourseRequirement } from './entities/course-requirement.entity';

export interface CreateStudyPlanDto {
  name: string;
  departmentId: string;
  totalCredits: number;
  courseRequirements?: Array<{
    courseId: string;
    mandatory: boolean;
    bucket: 'UNIV_MAND' | 'UNIV_ELECT' | 'COLL_MAND' | 'COLL_ELECT' | 'DEPT_MAND' | 'DEPT_ELECT';
    minSemesterIndex?: number;
  }>;
}

export interface UpdateStudyPlanDto extends Partial<CreateStudyPlanDto> {}

@Injectable()
export class StudyPlansService {
  constructor(
    @InjectRepository(StudyPlan) private readonly studyPlanRepo: Repository<StudyPlan>,
    @InjectRepository(CourseRequirement) private readonly courseReqRepo: Repository<CourseRequirement>,
  ) {}

  async create(dto: CreateStudyPlanDto) {
    const plan = this.studyPlanRepo.create({
      name: dto.name,
      departmentId: dto.departmentId,
      totalCredits: dto.totalCredits,
    });
    const saved = await this.studyPlanRepo.save(plan);
    if (dto.courseRequirements?.length) {
      const reqs = dto.courseRequirements.map((r) =>
        this.courseReqRepo.create({
          studyPlanId: saved.id,
          courseId: r.courseId,
          mandatory: r.mandatory,
          bucket: r.bucket,
          minSemesterIndex: r.minSemesterIndex,
        }),
      );
      await this.courseReqRepo.save(reqs);
    }
    return this.findOne(saved.id);
  }

  async findAll() {
    return this.studyPlanRepo.find({ relations: ['courseRequirements'] });
  }

  async findOne(id: string) {
    const plan = await this.studyPlanRepo.findOne({ where: { id }, relations: ['courseRequirements'] });
    if (!plan) throw new NotFoundException('Study plan not found');
    return plan;
  }

  async update(id: string, dto: UpdateStudyPlanDto) {
    const plan = await this.findOne(id);
    await this.studyPlanRepo.update(id, {
      name: dto.name ?? plan.name,
      departmentId: dto.departmentId ?? plan.departmentId,
      totalCredits: dto.totalCredits ?? plan.totalCredits,
    });
    if (dto.courseRequirements) {
      // Replace requirements for simplicity
      await this.courseReqRepo.delete({ studyPlanId: id });
      if (dto.courseRequirements.length) {
        const reqs = dto.courseRequirements.map((r) =>
          this.courseReqRepo.create({
            studyPlanId: id,
            courseId: r.courseId,
            mandatory: r.mandatory,
            bucket: r.bucket,
            minSemesterIndex: r.minSemesterIndex,
          }),
        );
        await this.courseReqRepo.save(reqs);
      }
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.courseReqRepo.delete({ studyPlanId: id });
    const res = await this.studyPlanRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Study plan not found');
    return { deleted: true };
  }
}


