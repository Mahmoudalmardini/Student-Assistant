import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Bus } from '../../transportation/entities/bus.entity';

@Entity('bus_locations')
export class BusLocation extends BaseEntity {
  @ManyToOne(() => Bus, (bus) => bus.locationHistory)
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @Column()
  busId: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed: number; // km/h

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heading: number; // degrees

  @Column({ default: true })
  isActive: boolean;
}
