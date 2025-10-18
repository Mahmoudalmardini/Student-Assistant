import { IsString, IsOptional, IsEmail, Matches, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/interfaces/auth.interface';

export class UpdateUserDto {
  @ApiProperty({ example: 'updated_username', description: 'Updated username', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  })
  username?: string;

  @ApiProperty({ example: 'updated@university.edu', description: 'Updated email address', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.STUDENT,
    description: 'Updated role',
    required: false 
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: student, admin, college_coordinator, transportation_coordinator, super_admin' })
  role?: UserRole;

  @ApiProperty({ example: 'NewPassword@123!', description: 'New password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password?: string;
}

