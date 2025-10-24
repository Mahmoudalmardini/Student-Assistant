import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Route } from './entities/route.entity';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  async create(createRouteDto: any): Promise<Route> {
    const route = this.routeRepository.create(createRouteDto);
    const savedRoute = await this.routeRepository.save(route);
    return Array.isArray(savedRoute) ? savedRoute[0] : savedRoute;
  }

  async findAll(): Promise<Route[]> {
    return await this.routeRepository.find({
      where: { isActive: true },
      relations: ['busRoutes'],
    });
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id, isActive: true },
      relations: ['busRoutes'],
    });

    if (!route) {
      throw new NotFoundException('Route not found');
    }

    return route;
  }

  async update(id: string, updateRouteDto: any): Promise<Route> {
    await this.routeRepository.update(id, updateRouteDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.routeRepository.softDelete(id);
  }
}
