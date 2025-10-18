import { IsString, MinLength, IsEmail, Matches, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CoordinatorType {
  COLLEGE = 'college_coordinator',
  TRANSPORTATION = 'transportation_coordinator',
}

export class CreateCoordinatorDto {
  @ApiProperty({ example: 'coordinator_user', description: 'Username for the coordinator' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({ example: 'Coordinator@123!', description: 'Password for the coordinator' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @ApiProperty({ example: 'coordinator@university.edu', description: 'Email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ 
    enum: CoordinatorType, 
    example: CoordinatorType.COLLEGE,
    description: 'Type of coordinator: college_coordinator or transportation_coordinator' 
  })
  @IsEnum(CoordinatorType, { message: 'Coordinator type must be either college_coordinator or transportation_coordinator' })
  coordinatorType: CoordinatorType;
}

