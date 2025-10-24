import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { College } from './entities/college.entity';

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College)
    private collegeRepository: Repository<College>,
  ) {}

  async create(createCollegeDto: any): Promise<College> {
    const college = this.collegeRepository.create(createCollegeDto);
    return await this.collegeRepository.save(college);
  }

  async findAll(): Promise<College[]> {
    return await this.collegeRepository.find({
      where: { isActive: true },
      relations: ['users'],
    });
  }

  async findOne(id: string): Promise<College> {
    const college = await this.collegeRepository.findOne({
      where: { id, isActive: true },
      relations: ['users'],
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }

  async update(id: string, updateCollegeDto: any): Promise<College> {
    await this.collegeRepository.update(id, updateCollegeDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.collegeRepository.softDelete(id);
  }
}
