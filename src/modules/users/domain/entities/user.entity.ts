import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@shared/domain/base.entity';

/**
 * User Domain Entity
 * Represents a user in the system
 */
@Entity({ schema: process.env.DB_USERS_SCHEMA || 'users_schema', name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}