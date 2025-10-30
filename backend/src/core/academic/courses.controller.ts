import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';
import { CoursesService } from './courses.service';
import type { UpsertCourseDto } from './courses.service';
import type { Response } from 'express';
import { Res } from '@nestjs/common';

@ApiTags('Academic - Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academic/courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'List courses' })
  list() {
    return this.service.list();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Create a course' })
  create(@Body() dto: UpsertCourseDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Update a course' })
  update(@Param('id') id: string, @Body() dto: Partial<UpsertCourseDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':id/prerequisites')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'List prerequisites for a course' })
  listPrereq(@Param('id') id: string) {
    return this.service.listPrerequisites(id);
  }

  @Post(':id/prerequisites')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Set prerequisites for a course (replace all)' })
  setPrereq(@Param('id') id: string, @Body() body: { prereqCourseIds: string[] }) {
    return this.service.setPrerequisites(id, body.prereqCourseIds || []);
  }

  @Get('export/csv')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Export courses CSV' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.service.exportCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="courses.csv"');
    res.send(csv);
  }

  @Post('import/csv')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.COLLEGE_SUPERVISOR)
  @ApiOperation({ summary: 'Import courses CSV' })
  async importCsv(@Body() body: { csv: string }) {
    return this.service.importCsv(body.csv || '');
  }
}


