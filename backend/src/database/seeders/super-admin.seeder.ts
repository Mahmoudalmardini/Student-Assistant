import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../../core/users/entities/user.entity';
import { UserRole } from '../../common/enums/user-roles.enum';

@Injectable()
export class SuperAdminSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    const superAdminExists = await this.userRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN, isActive: true }
    });

    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const superAdmin = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });

      await this.userRepository.save(superAdmin);
      console.log('Super admin account created successfully');
    } else {
      console.log('Super admin account already exists');
    }
  }
}
