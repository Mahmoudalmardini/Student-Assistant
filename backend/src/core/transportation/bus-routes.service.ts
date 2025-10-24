import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BusRoute } from './entities/bus-route.entity';

@Injectable()
export class BusRoutesService {
  constructor(
    @InjectRepository(BusRoute)
    private busRouteRepository: Repository<BusRoute>,
  ) {}

  async create(createBusRouteDto: any): Promise<BusRoute> {
    const busRoute = this.busRouteRepository.create(createBusRouteDto);
    const savedBusRoute = await this.busRouteRepository.save(busRoute);
    return Array.isArray(savedBusRoute) ? savedBusRoute[0] : savedBusRoute;
  }

  async findAll(): Promise<BusRoute[]> {
    return await this.busRouteRepository.find({
      where: { isActive: true },
      relations: ['bus', 'route'],
    });
  }

  async findOne(id: string): Promise<BusRoute> {
    const busRoute = await this.busRouteRepository.findOne({
      where: { id, isActive: true },
      relations: ['bus', 'route'],
    });

    if (!busRoute) {
      throw new NotFoundException('Bus route not found');
    }

    return busRoute;
  }

  async update(id: string, updateBusRouteDto: any): Promise<BusRoute> {
    await this.busRouteRepository.update(id, updateBusRouteDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.busRouteRepository.softDelete(id);
  }
}
