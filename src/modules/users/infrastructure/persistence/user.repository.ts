import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserSchema } from './user.schema';

/**
 * User Repository Implementation
 * Infrastructure layer - implements domain repository interface
 * Uses TypeORM but domain layer doesn't know about it
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findOne(criteria: Partial<User>): Promise<User | null> {
    return this.repository.findOne({ where: criteria as any });
  }

  async findAll(criteria?: Partial<User>, options?: any): Promise<User[]> {
    const findOptions: any = {};
    
    if (criteria) {
      findOptions.where = criteria;
    }
    
    if (options) {
      if (options.skip !== undefined) findOptions.skip = options.skip;
      if (options.take !== undefined) findOptions.take = options.take;
      if (options.order) findOptions.order = options.order;
    }
    
    return this.repository.find(findOptions);
  }

  async create(data: Partial<User>): Promise<User> {
    // Filter out undefined values to prevent empty strings
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
    
    const user = this.repository.create(cleanData);
    const saved = await this.repository.save(user);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`User with id ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(criteria?: Partial<User>): Promise<number> {
    if (criteria) {
      return this.repository.count({ where: criteria as any });
    }
    return this.repository.count();
  }

  async exists(criteria: Partial<User>): Promise<boolean> {
    const count = await this.repository.count({ where: criteria as any });
    return count > 0;
  }

  // User-specific methods
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } as any });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({ where: { isActive: true } as any });
  }
}