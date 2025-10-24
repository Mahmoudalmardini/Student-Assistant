import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { BusRoutesService } from './bus-routes.service';
import { BusRoutesController } from './bus-routes.controller';
import { Bus } from './entities/bus.entity';
import { Route } from './entities/route.entity';
import { BusRoute } from './entities/bus-route.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bus, Route, BusRoute])],
  controllers: [BusesController, RoutesController, BusRoutesController],
  providers: [BusesService, RoutesService, BusRoutesService],
  exports: [BusesService, RoutesService, BusRoutesService],
})
export class TransportationModule {}
