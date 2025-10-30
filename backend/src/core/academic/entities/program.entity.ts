import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('programs')
export class Program extends BaseEntity {
  @Column({ unique: true })
  name: string; // e.g., Software Engineering

  @Column({ nullable: true })
  version?: string; // e.g., 2016

  @Column({ type: 'text', nullable: true })
  notes?: string;
}


