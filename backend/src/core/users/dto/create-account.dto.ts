import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateIf, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../../common/enums/user-roles.enum';
import { CreateAdminDto } from './create-admin.dto';
import { CreateSupervisorDto } from './create-supervisor.dto';
import { CreateDriverDto } from './create-driver.dto';
import { CreateStudentDto } from './create-student.dto';

export class CreateAccountDto {
  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  @IsEnum(UserRole)
  role: UserRole;

  // Admin fields
  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsNotEmpty()
  firstName?: string;

  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsNotEmpty()
  lastName?: string;

  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsNotEmpty()
  username?: string;

  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsNotEmpty()
  password?: string;

  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsNotEmpty()
  confirmPassword?: string;

  // Supervisor fields (transportation and college)
  @ValidateIf(o => o.role === UserRole.TRANSPORTATION_SUPERVISOR || o.role === UserRole.COLLEGE_SUPERVISOR)
  @IsNotEmpty()
  supervisorFirstName?: string;

  @ValidateIf(o => o.role === UserRole.TRANSPORTATION_SUPERVISOR || o.role === UserRole.COLLEGE_SUPERVISOR)
  @IsNotEmpty()
  supervisorLastName?: string;

  @ValidateIf(o => o.role === UserRole.TRANSPORTATION_SUPERVISOR || o.role === UserRole.COLLEGE_SUPERVISOR)
  @IsNotEmpty()
  supervisorUsername?: string;

  @ValidateIf(o => o.role === UserRole.TRANSPORTATION_SUPERVISOR || o.role === UserRole.COLLEGE_SUPERVISOR)
  @IsNotEmpty()
  supervisorPassword?: string;

  @ValidateIf(o => o.role === UserRole.TRANSPORTATION_SUPERVISOR || o.role === UserRole.COLLEGE_SUPERVISOR)
  @IsNotEmpty()
  supervisorConfirmPassword?: string;

  // Driver fields
  @ValidateIf(o => o.role === UserRole.BUS_DRIVER)
  @IsNotEmpty()
  driverFirstName?: string;

  @ValidateIf(o => o.role === UserRole.BUS_DRIVER)
  @IsNotEmpty()
  driverLastName?: string;

  @ValidateIf(o => o.role === UserRole.BUS_DRIVER)
  @IsNotEmpty()
  driverUsername?: string;

  @ValidateIf(o => o.role === UserRole.BUS_DRIVER)
  @IsNotEmpty()
  driverPassword?: string;

  @ValidateIf(o => o.role === UserRole.BUS_DRIVER)
  @IsNotEmpty()
  driverConfirmPassword?: string;

  // Student fields
  @ValidateIf(o => o.role === UserRole.STUDENT)
  @IsNotEmpty()
  studentFirstName?: string;

  @ValidateIf(o => o.role === UserRole.STUDENT)
  @IsNotEmpty()
  studentLastName?: string;

  @ValidateIf(o => o.role === UserRole.STUDENT)
  @IsNotEmpty()
  universityId?: string;

  @ValidateIf(o => o.role === UserRole.STUDENT)
  @IsNotEmpty()
  studentPassword?: string;

  @ValidateIf(o => o.role === UserRole.STUDENT)
  @IsNotEmpty()
  studentConfirmPassword?: string;
}
