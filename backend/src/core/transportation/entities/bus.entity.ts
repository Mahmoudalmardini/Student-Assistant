import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { BusRoute } from './bus-route.entity';
import { BusLocation } from '../../tracking/entities/bus-location.entity';

@Entity('buses')
export class Bus extends BaseEntity {
  @Column({ unique: true })
  plateNumber: string;

  @Column()
  model: string;

  @Column()
  capacity: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentLatitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentLongitude: number;

  @Column({ nullable: true })
  lastLocationUpdate: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.assignedBuses, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column({ nullable: true })
  driverId: string;

  @OneToMany(() => BusRoute, (busRoute) => busRoute.bus)
  busRoutes: BusRoute[];

  @OneToMany(() => BusLocation, (location) => location.bus)
  locationHistory: BusLocation[];
}
