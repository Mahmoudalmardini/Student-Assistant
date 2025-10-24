import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';

import { BusLocation } from './entities/bus-location.entity';
import { Bus } from '../transportation/entities/bus.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(BusLocation)
    private busLocationRepository: Repository<BusLocation>,
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
  ) {}

  async updateBusLocation(
    busId: string,
    latitude: number,
    longitude: number,
    speed?: number,
    heading?: number,
  ): Promise<BusLocation> {
    // Create location history entry
    const location = this.busLocationRepository.create({
      busId,
      latitude,
      longitude,
      speed,
      heading,
    });

    // Update current bus location
    await this.busRepository.update(busId, {
      currentLatitude: latitude,
      currentLongitude: longitude,
      lastLocationUpdate: new Date(),
    });

    return await this.busLocationRepository.save(location);
  }

  async getBusLocationHistory(busId: string): Promise<BusLocation[]> {
    return await this.busLocationRepository.find({
      where: { busId, isActive: true },
      order: { createdAt: 'DESC' },
      take: 100, // Last 100 location updates
    });
  }

  async getAllActiveBusLocations(): Promise<Bus[]> {
    return await this.busRepository.find({
      where: { 
        isActive: true,
        currentLatitude: Not(IsNull()),
        currentLongitude: Not(IsNull()),
      },
      relations: ['driver'],
    });
  }
}
