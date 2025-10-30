import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column()
  actorId: string;

  @Column()
  action: string; // e.g., CREATE/UPDATE/DELETE/IMPORT

  @Column()
  entity: string; // table/entity name

  @Column()
  entityId: string;

  @Column({ type: 'jsonb', nullable: true })
  diff?: unknown;
}


