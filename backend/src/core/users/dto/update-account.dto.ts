import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({ example: 'johndoe_updated', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  username?: string;

  @ApiProperty({ example: 'STU2024001', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'University ID can only contain letters and numbers' })
  universityId?: string;

  @ApiProperty({ example: 'newpassword123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'newpassword123', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  confirmPassword?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'DL123456', required: false })
  @IsOptional()
  @IsString()
  driverLicenseNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  collegeId?: string;
}
