import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BusRoute } from './bus-route.entity';

@Entity('routes')
export class Route extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column('jsonb')
  waypoints: Array<{
    latitude: number;
    longitude: number;
    name: string;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  distance: number;

  @Column({ type: 'integer' })
  estimatedDuration: number; // in minutes

  @Column({ default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => BusRoute, (busRoute) => busRoute.route)
  busRoutes: BusRoute[];
}
