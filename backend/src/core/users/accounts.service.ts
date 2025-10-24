import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';
import { UserRole } from '../../common/enums/user-roles.enum';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAccount(dto: CreateAccountDto, creatorRole: UserRole): Promise<User> {
    // Validate creator permissions
    this.validateCreatePermissions(dto.role, creatorRole);

    // Validate password confirmation
    this.validatePasswordConfirmation(dto);

    // Check for existing username/universityId
    await this.checkUniqueIdentifiers(dto);

    // Hash password
    const hashedPassword = await bcrypt.hash(this.getPassword(dto), 12);

    // Create user object based on role
    const userData = this.buildUserData(dto, hashedPassword);
    
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async getAllAccounts(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      select: ['id', 'firstName', 'lastName', 'username', 'universityId', 'role', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async getAccountById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException('Account not found');
    }

    return user;
  }

  async updateAccount(id: string, dto: UpdateAccountDto, updaterRole: UserRole): Promise<User> {
    const user = await this.getAccountById(id);

    // Validate password confirmation if password is being updated
    if (dto.password && dto.confirmPassword) {
      if (dto.password !== dto.confirmPassword) {
        throw new BadRequestException('Password and confirm password do not match');
      }
    }

    // Check for unique identifiers if they're being updated
    if (dto.username || dto.universityId) {
      await this.checkUniqueIdentifiersUpdate(dto, id);
    }

    // Hash new password if provided
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
      delete dto.confirmPassword; // Remove confirmPassword from update
    }

    await this.userRepository.update(id, dto);
    return await this.getAccountById(id);
  }

  async deleteAccount(id: string, deleterRole: UserRole): Promise<void> {
    if (deleterRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can delete accounts');
    }

    const user = await this.getAccountById(id);
    await this.userRepository.update(id, { isActive: false });
  }

  async getAccountsByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.find({
      where: { role, isActive: true },
      select: ['id', 'firstName', 'lastName', 'username', 'universityId', 'role', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  private validateCreatePermissions(roleToCreate: UserRole, creatorRole: UserRole): void {
    if (roleToCreate === UserRole.ADMIN && creatorRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can create admin accounts');
    }

    if (creatorRole !== UserRole.SUPER_ADMIN && creatorRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only super admin and admin can create accounts');
    }
  }

  private validatePasswordConfirmation(dto: CreateAccountDto): void {
    const password = this.getPassword(dto);
    const confirmPassword = this.getConfirmPassword(dto);

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }
  }

  private async checkUniqueIdentifiers(dto: CreateAccountDto): Promise<void> {
    const username = this.getUsername(dto);
    const universityId = this.getUniversityId(dto);

    if (username) {
      const existingUser = await this.userRepository.findOne({
        where: { username, isActive: true }
      });
      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (universityId) {
      const existingUser = await this.userRepository.findOne({
        where: { universityId, isActive: true }
      });
      if (existingUser) {
        throw new BadRequestException('University ID already exists');
      }
    }
  }

  private async checkUniqueIdentifiersUpdate(dto: UpdateAccountDto, userId: string): Promise<void> {
    if (dto.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: dto.username, isActive: true }
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (dto.universityId) {
      const existingUser = await this.userRepository.findOne({
        where: { universityId: dto.universityId, isActive: true }
      });
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('University ID already exists');
      }
    }
  }

  private buildUserData(dto: CreateAccountDto, hashedPassword: string): Partial<User> {
    const baseData = {
      firstName: this.getFirstName(dto),
      lastName: this.getLastName(dto),
      password: hashedPassword,
      role: dto.role,
      isActive: true,
    };

    switch (dto.role) {
      case UserRole.ADMIN:
        return {
          ...baseData,
          username: dto.username,
        };

      case UserRole.TRANSPORTATION_SUPERVISOR:
      case UserRole.COLLEGE_SUPERVISOR:
        return {
          ...baseData,
          username: dto.supervisorUsername,
        };

      case UserRole.BUS_DRIVER:
        return {
          ...baseData,
          username: dto.driverUsername,
        };

      case UserRole.STUDENT:
        return {
          ...baseData,
          universityId: dto.universityId,
        };

      default:
        throw new BadRequestException('Invalid role');
    }
  }

  private getFirstName(dto: CreateAccountDto): string {
    switch (dto.role) {
      case UserRole.ADMIN: return dto.firstName!;
      case UserRole.TRANSPORTATION_SUPERVISOR:
      case UserRole.COLLEGE_SUPERVISOR: return dto.supervisorFirstName!;
      case UserRole.BUS_DRIVER: return dto.driverFirstName!;
      case UserRole.STUDENT: return dto.studentFirstName!;
      default: throw new BadRequestException('Invalid role');
    }
  }

  private getLastName(dto: CreateAccountDto): string {
    switch (dto.role) {
      case UserRole.ADMIN: return dto.lastName!;
      case UserRole.TRANSPORTATION_SUPERVISOR:
      case UserRole.COLLEGE_SUPERVISOR: return dto.supervisorLastName!;
      case UserRole.BUS_DRIVER: return dto.driverLastName!;
      case UserRole.STUDENT: return dto.studentLastName!;
      default: throw new BadRequestException('Invalid role');
    }
  }

  private getUsername(dto: CreateAccountDto): string | null {
    switch (dto.role) {
      case UserRole.ADMIN: return dto.username!;
      case UserRole.TRANSPORTATION_SUPERVISOR:
      case UserRole.COLLEGE_SUPERVISOR: return dto.supervisorUsername!;
      case UserRole.BUS_DRIVER: return dto.driverUsername!;
      case UserRole.STUDENT: return null;
      default: throw new BadRequestException('Invalid role');
    }
  }

  private getUniversityId(dto: CreateAccountDto): string | null {
    return dto.role === UserRole.STUDENT ? dto.universityId! : null;
  }

  private getPassword(dto: CreateAccountDto): string {
    switch (dto.role) {
      case UserRole.ADMIN: return dto.password!;
      case UserRole.TRANSPORTATION_SUPERVISOR:
      case UserRole.COLLEGE_SUPERVISOR: return dto.supervisorPassword!;
      case UserRole.BUS_DRIVER: return dto.driverPassword!;
      case UserRole.STUDENT: return dto.studentPassword!;
      default: throw new BadRequestException('Invalid role');
    }
  }

  private getConfirmPassword(dto: CreateAccountDto): string {
    switch (dto.role) {
      case UserRole.ADMIN: return dto.confirmPassword!;
      case UserRole.TRANSPORTATION_SUPERVISOR:
      case UserRole.COLLEGE_SUPERVISOR: return dto.supervisorConfirmPassword!;
      case UserRole.BUS_DRIVER: return dto.driverConfirmPassword!;
      case UserRole.STUDENT: return dto.studentConfirmPassword!;
      default: throw new BadRequestException('Invalid role');
    }
  }
}
