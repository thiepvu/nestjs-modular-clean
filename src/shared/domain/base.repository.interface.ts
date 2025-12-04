/**
 * Pagination Options
 */
export interface PaginationOptions {
  skip?: number;
  take?: number;
  order?: Record<string, 'ASC' | 'DESC'>;
}

/**
 * Base Repository Interface - Pure Domain
 * No framework dependencies
 * All repositories should implement this interface
 */
export interface IBaseRepository<T> {
  /**
   * Find entity by ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find one entity by criteria
   */
  findOne(criteria: Partial<T>): Promise<T | null>;

  /**
   * Find all entities with optional filtering and pagination
   */
  findAll(criteria?: Partial<T>, options?: PaginationOptions): Promise<T[]>;

  /**
   * Create new entity
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update entity
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete entity
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count entities
   */
  count(criteria?: Partial<T>): Promise<number>;

  /**
   * Check if entity exists
   */
  exists(criteria: Partial<T>): Promise<boolean>;
}