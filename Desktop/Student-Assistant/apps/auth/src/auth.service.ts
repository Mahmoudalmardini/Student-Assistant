import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './users/dto/create-user.dto';
import { 
  AuthResponse, 
  User, 
  JwtPayload,
  IAuthService 
} from './common/interfaces/auth.interface';
import {
  UserAlreadyExistsException,
  EmailAlreadyExistsException,
  InvalidCredentialsException,
  UserNotFoundException,
  InvalidTokenException,
  EmailNotVerifiedException,
  AccountLockedException,
} from './common/exceptions/auth.exceptions';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly maxLoginAttempts = 5;
  private readonly lockTime = 2 * 60 * 60 * 1000; // 2 hours

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    this.logger.log(`Registering new user: ${dto.username}`);

    // Check if username already exists
    const existingUser = await this.usersRepo.findByUsername(dto.username);
    if (existingUser) {
      throw new UserAlreadyExistsException(dto.username);
    }

    // Check if email already exists
    const existingEmail = await this.usersRepo.findByEmail(dto.email);
    if (existingEmail) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    // Hash password
    const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await this.usersRepo.createUser({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    // Set email verification token
    await this.usersRepo.setEmailVerificationToken(dto.email, emailVerificationToken);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    this.logger.log(`User registered successfully: ${user.username}`);
    
    // TODO: Send email verification email
    
    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) {
      return null;
    }

    // Check if account is locked
    if (user.isLocked) {
      this.logger.warn(`Login attempt on locked account: ${username}`);
      return null;
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      this.logger.warn(`Login attempt with unverified email: ${username}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.handleFailedLogin(user.username);
      return null;
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await this.usersRepo.resetLoginAttempts(user.username);
    }

    return user;
  }

  async login(dto: { username: string; password: string }): Promise<AuthResponse> {
    this.logger.log(`Login attempt for user: ${dto.username}`);

    const user = await this.validateUser(dto.username, dto.password);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const tokens = await this.generateTokens(user);

    this.logger.log(`User logged in successfully: ${user.username}`);

    return {
      ...tokens,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('jwtRefreshSecret'),
      }) as JwtPayload;

      const user = await this.usersRepo.findById(payload.sub);
      if (!user) {
        throw new UserNotFoundException();
      }

      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async logout(userId: string): Promise<void> {
    this.logger.log(`User logged out: ${userId}`);
    // In a real application, you might want to blacklist the token
    // or store logout information in a database
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      this.logger.warn(`Password reset requested for non-existent email: ${email}`);
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.usersRepo.setPasswordResetToken(email, resetToken, resetExpires);

    this.logger.log(`Password reset token generated for: ${email}`);
    
    // TODO: Send password reset email
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const user = await this.usersRepo.resetPassword(token, hashedPassword);
    if (!user) {
      throw new InvalidTokenException();
    }

    this.logger.log(`Password reset successfully for user: ${user.username}`);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.usersRepo.verifyEmail(token);
    if (!user) {
      throw new InvalidTokenException();
    }

    this.logger.log(`Email verified for user: ${user.username}`);
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    await this.usersRepo.setEmailVerificationToken(email, verificationToken);

    this.logger.log(`Verification email resent for: ${email}`);
    
    // TODO: Send email verification email
  }

  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get<string>('jwtExpiresIn', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwtRefreshSecret'),
      expiresIn: this.config.get<string>('jwtRefreshExpiresIn', '7d'),
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.get<string>('jwtExpiresIn', '15m'),
    };
  }

  private async handleFailedLogin(username: string): Promise<void> {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) return;

    const attempts = user.loginAttempts + 1;
    const lockUntil = attempts >= this.maxLoginAttempts 
      ? new Date(Date.now() + this.lockTime) 
      : undefined;

    await this.usersRepo.updateLoginAttempts(username, attempts, lockUntil);

    if (attempts >= this.maxLoginAttempts) {
      this.logger.warn(`Account locked due to failed login attempts: ${username}`);
    }
  }

  // User Management Methods (Super Admin only)
  async createUserByAdmin(userData: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Promise<any> {
    this.logger.log(`Admin creating new user: ${userData.username}`);

    // Check if username already exists
    const existingUser = await this.usersRepo.findByUsername(userData.username);
    if (existingUser) {
      throw new UserAlreadyExistsException(userData.username);
    }

    // Check if email already exists
    const existingEmail = await this.usersRepo.findByEmail(userData.email);
    if (existingEmail) {
      throw new EmailAlreadyExistsException(userData.email);
    }

    // Hash password
    const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user with email pre-verified
    const user = await this.usersRepo.createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role as any,
    });

    // Auto-verify email for admin-created users
    await this.usersRepo.verifyEmail(user.emailVerificationToken || '');

    this.logger.log(`User created by admin: ${user.username} with role ${user.role}`);
    
    return user;
  }

  async listUsers(filter?: { role?: string }): Promise<any[]> {
    this.logger.log('Fetching users list');
    const queryFilter = filter?.role ? { role: filter.role } : {};
    return this.usersRepo.findAll(queryFilter);
  }

  async updateUserById(userId: string, updateData: any): Promise<any> {
    this.logger.log(`Updating user: ${userId}`);

    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    // If updating username, check if new username exists
    if (updateData.username && updateData.username !== user.username) {
      const existingUser = await this.usersRepo.findByUsername(updateData.username);
      if (existingUser) {
        throw new UserAlreadyExistsException(updateData.username);
      }
    }

    // If updating email, check if new email exists
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await this.usersRepo.findByEmail(updateData.email);
      if (existingEmail) {
        throw new EmailAlreadyExistsException(updateData.email);
      }
    }

    // Hash password if provided
    if (updateData.password) {
      const saltRounds = this.config.get<number>('bcryptSaltRounds', 12);
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUser = await this.usersRepo.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new UserNotFoundException();
    }

    this.logger.log(`User updated: ${updatedUser.username}`);
    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<void> {
    this.logger.log(`Deleting user: ${userId}`);

    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.usersRepo.deleteUser(userId);
    this.logger.log(`User deleted: ${user.username}`);
  }
}
