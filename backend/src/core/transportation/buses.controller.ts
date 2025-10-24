import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { BusesService } from './buses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Buses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRANSPORTATION_SUPERVISOR)
  @ApiOperation({ summary: 'Create a new bus' })
  async create(@Body() createBusDto: any) {
    return this.busesService.create(createBusDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all buses' })
  async findAll() {
    return this.busesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bus by ID' })
  async findOne(@Param('id') id: string) {
    return this.busesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TRANSPORTATION_SUPERVISOR)
  @ApiOperation({ summary: 'Update bus' })
  async update(@Param('id') id: string, @Body() updateBusDto: any) {
    return this.busesService.update(id, updateBusDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete bus' })
  async remove(@Param('id') id: string) {
    return this.busesService.remove(id);
  }

  @Patch(':id/location')
  @Roles(UserRole.BUS_DRIVER)
  @ApiOperation({ summary: 'Update bus location' })
  async updateLocation(
    @Param('id') id: string,
    @Body() locationDto: { latitude: number; longitude: number },
  ) {
    return this.busesService.updateLocation(id, locationDto.latitude, locationDto.longitude);
  }
}
