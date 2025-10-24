import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TrackingGateway } from './tracking.gateway';
import { BusLocation } from './entities/bus-location.entity';
import { Bus } from '../transportation/entities/bus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusLocation, Bus])],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingGateway],
  exports: [TrackingService, TrackingGateway],
})
export class TrackingModule {}
