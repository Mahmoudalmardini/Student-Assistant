import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'johndoe_admin', 
    description: 'Username for non-students or University ID for students' 
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
