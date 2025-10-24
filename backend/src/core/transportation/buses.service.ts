import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bus } from './entities/bus.entity';

@Injectable()
export class BusesService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
  ) {}

  async create(createBusDto: any): Promise<Bus> {
    const bus = this.busRepository.create(createBusDto);
    const savedBus = await this.busRepository.save(bus);
    return Array.isArray(savedBus) ? savedBus[0] : savedBus;
  }

  async findAll(): Promise<Bus[]> {
    return await this.busRepository.find({
      where: { isActive: true },
      relations: ['driver', 'busRoutes', 'busRoutes.route'],
    });
  }

  async findOne(id: string): Promise<Bus> {
    const bus = await this.busRepository.findOne({
      where: { id, isActive: true },
      relations: ['driver', 'busRoutes', 'busRoutes.route'],
    });

    if (!bus) {
      throw new NotFoundException('Bus not found');
    }

    return bus;
  }

  async update(id: string, updateBusDto: any): Promise<Bus> {
    await this.busRepository.update(id, updateBusDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.busRepository.softDelete(id);
  }

  async updateLocation(busId: string, latitude: number, longitude: number): Promise<Bus> {
    await this.busRepository.update(busId, {
      currentLatitude: latitude,
      currentLongitude: longitude,
      lastLocationUpdate: new Date(),
    });
    return await this.findOne(busId);
  }
}
