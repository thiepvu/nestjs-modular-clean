import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, ObjectLiteral } from 'typeorm';
import { IBaseRepository } from '@shared/domain/base.repository.interface';
import { NotFoundException } from '@nestjs/common';

/**
 * Base Repository Implementation using TypeORM
 * Provides common CRUD operations
 */
export abstract class BaseRepositoryImpl<T extends ObjectLiteral> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(where);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    
    Object.assign(entity, data);
    return this.repository.save(entity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.countBy(where);
    return count > 0;
  }
}