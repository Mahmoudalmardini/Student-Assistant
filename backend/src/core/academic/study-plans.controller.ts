import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudyPlansService } from './study-plans.service';
import type { CreateStudyPlanDto, UpdateStudyPlanDto } from './study-plans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Academic - Study Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic/study-plans')
export class StudyPlansController {
  constructor(private readonly service: StudyPlansService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Create study plan with optional course requirements' })
  create(@Body() dto: CreateStudyPlanDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'List study plans' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Get a study plan' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Update a study plan' })
  update(@Param('id') id: string, @Body() dto: UpdateStudyPlanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Delete a study plan' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':id/totals')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Compute totals by bucket for a study plan' })
  totals(@Param('id') id: string) {
    return this.service.computeTotalsByBucket(id);
  }
}


