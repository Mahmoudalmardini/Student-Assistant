import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';
import { PrereqService } from './prereq.service';

@ApiTags('Academic - Prerequisites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic/prereqs')
export class PrereqController {
  constructor(private readonly service: PrereqService) {}

  @Get('validate')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Validate prerequisite graph (detect cycles)' })
  validate() {
    return this.service.validateGraph();
  }
}


