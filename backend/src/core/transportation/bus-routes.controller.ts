import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { BusRoutesService } from './bus-routes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Bus Routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bus-routes')
export class BusRoutesController {
  constructor(private readonly busRoutesService: BusRoutesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRANSPORTATION_SUPERVISOR)
  @ApiOperation({ summary: 'Create a new bus route assignment' })
  async create(@Body() createBusRouteDto: any) {
    return this.busRoutesService.create(createBusRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bus route assignments' })
  async findAll() {
    return this.busRoutesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bus route assignment by ID' })
  async findOne(@Param('id') id: string) {
    return this.busRoutesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRANSPORTATION_SUPERVISOR)
  @ApiOperation({ summary: 'Update bus route assignment' })
  async update(@Param('id') id: string, @Body() updateBusRouteDto: any) {
    return this.busRoutesService.update(id, updateBusRouteDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete bus route assignment' })
  async remove(@Param('id') id: string) {
    return this.busRoutesService.remove(id);
  }
}
