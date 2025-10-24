import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../../common/enums/user-roles.enum';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'STU001', required: false })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({ example: 'DL123456', required: false })
  @IsOptional()
  @IsString()
  driverLicenseNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  collegeId?: string;
}
