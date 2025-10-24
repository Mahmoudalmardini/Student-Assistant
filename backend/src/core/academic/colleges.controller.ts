import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CollegesService } from './colleges.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Colleges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new college' })
  async create(@Body() createCollegeDto: any) {
    return this.collegesService.create(createCollegeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all colleges' })
  async findAll() {
    return this.collegesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get college by ID' })
  async findOne(@Param('id') id: string) {
    return this.collegesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update college' })
  async update(@Param('id') id: string, @Body() updateCollegeDto: any) {
    return this.collegesService.update(id, updateCollegeDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete college' })
  async remove(@Param('id') id: string) {
    return this.collegesService.remove(id);
  }
}
