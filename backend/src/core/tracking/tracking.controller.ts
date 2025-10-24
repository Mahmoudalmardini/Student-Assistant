import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-roles.enum';

@ApiTags('Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('bus/:busId/location')
  @Roles(UserRole.BUS_DRIVER)
  @ApiOperation({ summary: 'Update bus location' })
  async updateBusLocation(
    @Param('busId') busId: string,
    @Body() locationDto: {
      latitude: number;
      longitude: number;
      speed?: number;
      heading?: number;
    },
  ) {
    return this.trackingService.updateBusLocation(
      busId,
      locationDto.latitude,
      locationDto.longitude,
      locationDto.speed,
      locationDto.heading,
    );
  }

  @Get('bus/:busId/history')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.TRANSPORTATION_SUPERVISOR,
    UserRole.STUDENT,
  )
  @ApiOperation({ summary: 'Get bus location history' })
  async getBusLocationHistory(@Param('busId') busId: string) {
    return this.trackingService.getBusLocationHistory(busId);
  }

  @Get('buses/active')
  @ApiOperation({ summary: 'Get all active bus locations' })
  async getAllActiveBusLocations() {
    return this.trackingService.getAllActiveBusLocations();
  }
}
