import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterDay } from './entities/semester-day.entity';
import { ScheduledSection } from './entities/scheduled-section.entity';
import { SectionType } from './entities/section-type.enum';
import { TimeSlot } from './entities/time-slot.enum';

export interface CreateSemesterDayDto {
  semesterId: string;
  dayOfWeek: string; // MON..SUN
}

export interface UpdateSemesterDayDto extends Partial<CreateSemesterDayDto> {}

export interface CreateScheduledSectionDto {
  courseId: string;
  semesterDayId: string;
  sectionType: SectionType;
  slots: TimeSlot[];
}

export interface UpdateScheduledSectionDto extends Partial<CreateScheduledSectionDto> {}

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(SemesterDay) private readonly dayRepo: Repository<SemesterDay>,
    @InjectRepository(ScheduledSection) private readonly sectionRepo: Repository<ScheduledSection>,
  ) {}

  // Days
  createDay(dto: CreateSemesterDayDto) {
    return this.dayRepo.save(this.dayRepo.create(dto));
  }

  findDays(semesterId?: string) {
    if (semesterId) return this.dayRepo.find({ where: { semesterId } });
    return this.dayRepo.find();
  }

  async updateDay(id: string, dto: UpdateSemesterDayDto) {
    const day = await this.dayRepo.findOne({ where: { id } });
    if (!day) throw new NotFoundException('Semester day not found');
    await this.dayRepo.update(id, dto);
    return this.dayRepo.findOne({ where: { id } });
  }

  async removeDay(id: string) {
    await this.sectionRepo.delete({ semesterDayId: id });
    const res = await this.dayRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Semester day not found');
    return { deleted: true };
  }

  // Sections
  async createSection(dto: CreateScheduledSectionDto) {
    const section = this.sectionRepo.create(dto);
    return this.sectionRepo.save(section);
  }

  findSectionsByDay(semesterDayId: string) {
    return this.sectionRepo.find({ where: { semesterDayId } });
  }

  async updateSection(id: string, dto: UpdateScheduledSectionDto) {
    const found = await this.sectionRepo.findOne({ where: { id } });
    if (!found) throw new NotFoundException('Scheduled section not found');
    await this.sectionRepo.update(id, dto);
    return this.sectionRepo.findOne({ where: { id } });
  }

  async removeSection(id: string) {
    const res = await this.sectionRepo.delete(id);
    if (!res.affected) throw new NotFoundException('Scheduled section not found');
    return { deleted: true };
  }
}


