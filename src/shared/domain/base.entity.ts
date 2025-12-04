/**
 * Base Entity - Pure Domain
 * No framework dependencies
 * All domain entities should extend this class
 */
export abstract class BaseEntity {
  id?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
    // Don't set id if undefined - let TypeORM generate it
    if (id) {
      this.id = id;
    }
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  /**
   * Check if entity is new (not persisted)
   */
  isNew(): boolean {
    return !this.id || this.id === '';
  }

  /**
   * Update timestamp
   */
  touch(): void {
    this.updatedAt = new Date();
  }
}