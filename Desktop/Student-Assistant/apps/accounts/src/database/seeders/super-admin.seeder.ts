import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { UserRole } from '../../common/interfaces/user.interface';

@Injectable()
export class SuperAdminSeeder {
  private readonly logger = new Logger(SuperAdminSeeder.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly config: ConfigService,
  ) {}

  async seed() {
    try {
      const superAdminConfig = this.config.get('superAdmin');
      const username = superAdminConfig.username;

      // Check if super admin already exists
      const existingSuperAdmin = await this.userModel.findOne({ 
        username: username.toLowerCase() 
      });

      if (existingSuperAdmin) {
        this.logger.log('Super admin already exists. Skipping seeding.');
        return;
      }

      // Hash the password
      const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
      const hashedPassword = await bcrypt.hash(superAdminConfig.password, saltRounds);

      // Create super admin
      const superAdmin = new this.userModel({
        username: username.toLowerCase(),
        email: superAdminConfig.email.toLowerCase(),
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isEmailVerified: true, // Auto-verify super admin
      });

      await superAdmin.save();

      this.logger.log('✅ Super admin created successfully!');
      this.logger.log(`   Username: ${username}`);
      this.logger.log(`   Password: ${superAdminConfig.password}`);
      this.logger.log(`   Email: ${superAdminConfig.email}`);
    } catch (error) {
      this.logger.error('Failed to seed super admin:', error.message);
    }
  }
}

