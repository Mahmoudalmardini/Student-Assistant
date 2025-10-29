import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MobileService } from './mobile.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('mobile')
@ApiBearerAuth()
@Controller('mobile/me')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get student mobile summary' })
  @Roles(UserRole.STUDENT)
  async getSummary(@Request() req: any) {
    return this.mobileService.getStudentSummary(req.user.id);
  }
}


