import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateCoordinatorDto, CoordinatorType } from './dto/create-coordinator.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/interfaces/user.interface';

@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create-admin')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new admin user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin user created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createAdmin(
    @Body(ValidationPipe) dto: CreateAdminDto,
    @Request() req: any,
  ) {
    const user = await this.accountsService.createUser(req.user.role, {
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

  @Post('create-coordinator')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new coordinator user (Super Admin & Admin)' })
  @ApiResponse({ status: 201, description: 'Coordinator user created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createCoordinator(
    @Body(ValidationPipe) dto: CreateCoordinatorDto,
    @Request() req: any,
  ) {
    const role =
      dto.coordinatorType === CoordinatorType.COLLEGE
        ? UserRole.COLLEGE_COORDINATOR
        : UserRole.TRANSPORTATION_COORDINATOR;

    const user = await this.accountsService.createUser(req.user.role, {
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

  @Post('create-student')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new student user (Super Admin & Admin)' })
  @ApiResponse({ status: 201, description: 'Student user created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createStudent(
    @Body(ValidationPipe) dto: CreateStudentDto,
    @Request() req: any,
  ) {
    const user = await this.accountsService.createUser(req.user.role, {
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

  @Get('users')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users (Super Admin & Admin)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getUsers(@Query('role') role?: string) {
    const users = await this.accountsService.listUsers(role ? { role } : undefined);
    return {
      count: users.length,
      users: users.map((user) => ({
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      })),
    };
  }

  @Get('users/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID (Super Admin & Admin)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.accountsService.getUserById(id);
    return {
      user: {
        id: user._id?.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Patch('users/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user details (Super Admin & Admin)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateUserDto,
  ) {
    const user = await this.accountsService.updateUser(id, dto);
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

  @Delete('users/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    await this.accountsService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}

