import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch,
  Delete,
  Query,
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './users/dto/login.dto';
import { RegisterDto } from './users/dto/register.dto';
import { ForgotPasswordDto } from './users/dto/forgot-password.dto';
import { ResetPasswordDto } from './users/dto/reset-password.dto';
import { RefreshTokenDto } from './users/dto/refresh-token.dto';
import { CreateAdminDto } from './users/dto/create-admin.dto';
import { CreateCoordinatorDto, CoordinatorType } from './users/dto/create-coordinator.dto';
import { CreateStudentDto } from './users/dto/create-student.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Public } from './common/decorators/public.decorator';
import { Roles } from './common/decorators/roles.decorator';
import { RolesGuard } from './common/guards/roles.guard';
import { UserRole } from './common/interfaces/auth.interface';

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Account locked or email not verified' })
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body(ValidationPipe) dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body(ValidationPipe) dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'Password reset email sent if account exists' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body(ValidationPipe) dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Password reset successfully' };
  }

  @Public()
  @Post('verify-email/:token')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Param('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerificationEmail(@Body('email') email: string) {
    await this.authService.resendVerificationEmail(email);
    return { message: 'Verification email sent' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.id);
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    return req.user;
  }

  @Post('test-super-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Test super admin access' })
  async testSuperAdmin(@Request() req: any) {
    return { message: 'Super admin access granted', user: req.user };
  }

  @Post('test-admin')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Test admin access' })
  async testAdmin(@Request() req: any) {
    return { message: 'Admin access granted', user: req.user };
  }

  // User Management Endpoints (Super Admin Only)
  @Post('admin/create-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new admin user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createAdmin(@Body(ValidationPipe) dto: CreateAdminDto) {
    const user = await this.authService.createUserByAdmin({
      ...dto,
      role: UserRole.ADMIN,
    });
    return {
      message: 'Admin user created successfully',
      user: {
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('admin/create-coordinator')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new coordinator user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Coordinator user created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createCoordinator(@Body(ValidationPipe) dto: CreateCoordinatorDto) {
    const role = dto.coordinatorType === CoordinatorType.COLLEGE 
      ? UserRole.COLLEGE_COORDINATOR 
      : UserRole.TRANSPORTATION_COORDINATOR;
    
    const user = await this.authService.createUserByAdmin({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role,
    });
    
    return {
      message: 'Coordinator user created successfully',
      user: {
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('admin/create-student')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new student user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Student user created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createStudent(@Body(ValidationPipe) dto: CreateStudentDto) {
    const user = await this.authService.createUserByAdmin({
      ...dto,
      role: UserRole.STUDENT,
    });
    return {
      message: 'Student user created successfully',
      user: {
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get('admin/users')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async getUsers(@Request() req: any) {
    const role = req.query?.role;
    const users = await this.authService.listUsers(role ? { role } : undefined);
    return {
      count: users.length,
      users: users.map(user => ({
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      })),
    };
  }

  @Patch('admin/users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user details (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('id') id: string, @Body(ValidationPipe) dto: UpdateUserDto) {
    const user = await this.authService.updateUserById(id, dto);
    return {
      message: 'User updated successfully',
      user: {
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Delete('admin/users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    await this.authService.deleteUserById(id);
    return { message: 'User deleted successfully' };
  }
}
