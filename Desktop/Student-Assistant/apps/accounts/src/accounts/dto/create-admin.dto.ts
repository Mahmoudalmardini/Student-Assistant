import { IsString, MinLength, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ example: 'admin_user', description: 'Username for the admin' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({ example: 'Admin@123!', description: 'Password for the admin' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ example: 'admin@university.edu', description: 'Email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

