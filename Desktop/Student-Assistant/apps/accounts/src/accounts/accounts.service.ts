import { Injectable, Logger } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/interfaces/user.interface';
import {
  UserAlreadyExistsException,
  EmailAlreadyExistsException,
  UserNotFoundException,
  UnauthorizedOperationException,
} from '../common/exceptions/accounts.exceptions';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private readonly accountsRepo: AccountsRepository,
    private readonly config: ConfigService,
  ) {}

  /**
   * Check if user has permission to create accounts of specified role
   * - SUPER_ADMIN: can create all roles including ADMIN
   * - ADMIN: can create COLLEGE_COORDINATOR, TRANSPORTATION_COORDINATOR, and STUDENT only
   */
  private canCreateRole(creatorRole: UserRole, targetRole: UserRole): boolean {
    if (creatorRole === UserRole.SUPER_ADMIN) {
      // Super admin can create all roles
      return true;
    }

    if (creatorRole === UserRole.ADMIN) {
      // Admin cannot create other admins or super admins
      return (
        targetRole !== UserRole.ADMIN && targetRole !== UserRole.SUPER_ADMIN
      );
    }

    return false;
  }

  /**
   * Create user account (used by Super Admin and Admin)
   */
  async createUser(
    creatorRole: UserRole,
    userData: {
      username: string;
      email: string;
      password: string;
      role: UserRole;
    },
  ): Promise<any> {
    // Check permissions
    if (!this.canCreateRole(creatorRole, userData.role)) {
      throw new UnauthorizedOperationException(
        `You are not authorized to create ${userData.role} accounts`,
      );
    }

    this.logger.log(`Creating new user: ${userData.username} with role ${userData.role}`);

    // Check if username already exists
    const existingUser = await this.accountsRepo.findByUsername(userData.username);
    if (existingUser) {
      throw new UserAlreadyExistsException(userData.username);
    }

    // Check if email already exists
    const existingEmail = await this.accountsRepo.findByEmail(userData.email);
    if (existingEmail) {
      throw new EmailAlreadyExistsException(userData.email);
    }

    // Hash password
    const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user
    const user = await this.accountsRepo.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    });

    this.logger.log(`User created successfully: ${user.username} with role ${user.role}`);

    return user;
  }

  /**
   * List all users with optional filtering
   */
  async listUsers(filter?: { role?: string }): Promise<any[]> {
    this.logger.log('Fetching users list');
    const queryFilter = filter?.role ? { role: filter.role } : {};
    return this.accountsRepo.findAll(queryFilter);
  }

  /**
   * Update user by ID
   */
  async updateUser(userId: string, updateData: any): Promise<any> {
    this.logger.log(`Updating user: ${userId}`);

    const user = await this.accountsRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // If updating username, check if new username exists
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.accountsRepo.findByUsername(
        updateData.username,
      );
      if (existingUser) {
        throw new UserAlreadyExistsException(updateData.username);
      }
    }

    // If updating email, check if new email exists
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await this.accountsRepo.findByEmail(updateData.email);
      if (existingEmail) {
        throw new EmailAlreadyExistsException(updateData.email);
      }
    }

    // Hash password if provided
    if (updateData.password) {
      const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUser = await this.accountsRepo.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new UserNotFoundException();
    }

    this.logger.log(`User updated: ${updatedUser.username}`);
    return updatedUser;
  }

  /**
   * Delete user by ID
   */
  async deleteUser(userId: string): Promise<void> {
    this.logger.log(`Deleting user: ${userId}`);

    const user = await this.accountsRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // Prevent deletion of super admin
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new UnauthorizedOperationException(
        'Cannot delete super admin account',
      );
    }

    await this.accountsRepo.deleteUser(userId);
    this.logger.log(`User deleted: ${user.username}`);
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any> {
    const user = await this.accountsRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}

