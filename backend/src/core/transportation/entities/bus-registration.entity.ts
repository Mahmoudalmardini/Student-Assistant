import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Bus } from './bus.entity';
import { Route } from './route.entity';

@Entity('bus_registrations')
@Unique('UQ_active_registration_per_user', ['userId', 'isActive'])
export class BusRegistration extends BaseEntity {
  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Bus, { nullable: true, eager: false })
  @JoinColumn({ name: 'busId' })
  bus?: Bus;

  @Column({ nullable: true })
  busId?: string;

  @ManyToOne(() => Route, { nullable: true, eager: false })
  @JoinColumn({ name: 'routeId' })
  route?: Route;

  @Column({ nullable: true })
  routeId?: string;

  @Column({ default: true })
  isActive: boolean;
}


