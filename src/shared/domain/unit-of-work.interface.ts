/**
 * Unit of Work Interface
 * Manages transactions across multiple repositories
 */
export interface IUnitOfWork {
  /**
   * Start a new transaction
   */
  startTransaction(): Promise<void>;

  /**
   * Commit the current transaction
   */
  commit(): Promise<void>;

  /**
   * Rollback the current transaction
   */
  rollback(): Promise<void>;

  /**
   * Execute operations within a transaction
   */
  withTransaction<T>(work: () => Promise<T>): Promise<T>;

  /**
   * Get repository instance within transaction context
   */
  getRepository<T>(repository: new (...args: any[]) => T): T;
}
