import { EntitySchema } from 'typeorm';
import { User } from '../../domain/entities/user.entity';

/**
 * TypeORM Schema for User Entity
 * Maps pure domain entity to database
 * This is in infrastructure layer - domain stays clean
 */
export const UserSchema = new EntitySchema<User>({
  name: 'User',
  tableName: 'users',
  schema: process.env.DB_USERS_SCHEMA || 'users_schema',
  target: User,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    firstName: {
      type: 'varchar',
      name: 'first_name',
    },
    lastName: {
      type: 'varchar',
      name: 'last_name',
    },
    password: {
      type: 'varchar',
    },
    isActive: {
      type: 'boolean',
      name: 'is_active',
      default: true,
    },
    createdAt: {
      type: 'timestamp',
      name: 'created_at',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      name: 'updated_at',
      updateDate: true,
    },
  },
  indices: [
    {
      name: 'IDX_USER_EMAIL',
      columns: ['email'],
    },
    {
      name: 'IDX_USER_IS_ACTIVE',
      columns: ['isActive'],
    },
  ],
});