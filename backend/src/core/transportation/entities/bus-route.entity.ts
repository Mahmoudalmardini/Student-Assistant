import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Bus } from './bus.entity';
import { Route } from './route.entity';

@Entity('bus_routes')
export class BusRoute extends BaseEntity {
  @ManyToOne(() => Bus, (bus) => bus.busRoutes)
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @Column()
  busId: string;

  @ManyToOne(() => Route, (route) => route.busRoutes)
  @JoinColumn({ name: 'routeId' })
  route: Route;

  @Column()
  routeId: string;

  @Column({ type: 'time' })
  departureTime: string;

  @Column({ type: 'time' })
  arrivalTime: string;

  @Column({ default: true })
  isActive: boolean;
}
