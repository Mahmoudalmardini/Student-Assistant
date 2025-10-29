import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScheduleService, CreateSemesterDayDto, UpdateSemesterDayDto, CreateScheduledSectionDto, UpdateScheduledSectionDto } from './schedule.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Academic - Schedule')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic/schedule')
export class ScheduleController {
  constructor(private readonly service: ScheduleService) {}

  // Days
  @Post('days')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Create a semester day (MON..SUN)' })
  createDay(@Body() dto: CreateSemesterDayDto) {
    return this.service.createDay(dto);
  }

  @Get('days')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'List semester days, optionally by semesterId' })
  listDays(@Query('semesterId') semesterId?: string) {
    return this.service.findDays(semesterId);
  }

  @Patch('days/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Update a semester day' })
  updateDay(@Param('id') id: string, @Body() dto: UpdateSemesterDayDto) {
    return this.service.updateDay(id, dto);
  }

  @Delete('days/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Delete a semester day (cascades sections)' })
  removeDay(@Param('id') id: string) {
    return this.service.removeDay(id);
  }

  // Sections
  @Post('sections')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Create a scheduled section for a course' })
  createSection(@Body() dto: CreateScheduledSectionDto) {
    return this.service.createSection(dto);
  }

  @Get('days/:semesterDayId/sections')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'List sections for a semester day' })
  listSections(@Param('semesterDayId') semesterDayId: string) {
    return this.service.findSectionsByDay(semesterDayId);
  }

  @Patch('sections/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Update a scheduled section' })
  updateSection(@Param('id') id: string, @Body() dto: UpdateScheduledSectionDto) {
    return this.service.updateSection(id, dto);
  }

  @Delete('sections/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Delete a scheduled section' })
  removeSection(@Param('id') id: string) {
    return this.service.removeSection(id);
  }
}


