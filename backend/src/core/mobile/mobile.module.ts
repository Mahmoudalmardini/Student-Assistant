import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';
import { AcademicModule } from '../academic/academic.module';
import { TransportationModule } from '../transportation/transportation.module';
import { UsersModule } from '../users/users.module';
import { BusRegistration } from '../transportation/entities/bus-registration.entity';

@Module({
  imports: [AcademicModule, TransportationModule, UsersModule, TypeOrmModule.forFeature([BusRegistration])],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}


