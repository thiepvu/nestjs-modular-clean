import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';

/**
 * Base Repository Interface
 * All repositories should implement this interface
 */
export interface IBaseRepository<T extends ObjectLiteral> {
  /**
   * Find entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find one entity by criteria
   */
  findOne(options: FindOneOptions<T>): Promise<T | null>;

  /**
   * Find all entities
   */
  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  /**
   * Find entities by criteria
   */
  findBy(where: FindOptionsWhere<T>): Promise<T[]>;

  /**
   * Create new entity
   */
  create(data: DeepPartial<T>): Promise<T>;

  /**
   * Update entity
   */
  update(id: string, data: DeepPartial<T>): Promise<T>;

  /**
   * Delete entity
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count entities
   */
  count(options?: FindManyOptions<T>): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(where: FindOptionsWhere<T>): Promise<boolean>;
}