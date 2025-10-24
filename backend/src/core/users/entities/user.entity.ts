import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserRole } from '../../../common/enums/user-roles.enum';
import { College } from '../../academic/entities/college.entity';
import { Bus } from '../../transportation/entities/bus.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  universityId: string;

  @Column({ nullable: true })
  driverLicenseNumber: string;

  @Column({ nullable: true })
  collegeId: string;

  // Relations
  @ManyToOne(() => College, (college) => college.users, { nullable: true })
  college: College;

  @OneToMany(() => Bus, (bus) => bus.driver, { nullable: true })
  assignedBuses: Bus[];
}
