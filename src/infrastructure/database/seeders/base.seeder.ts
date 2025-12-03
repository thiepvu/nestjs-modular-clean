import { DataSource, ObjectLiteral } from 'typeorm';

/**
 * Seeder Interface
 * All seeders must implement this interface
 */
export interface ISeeder {
  /**
   * Run the seeder
   */
  run(dataSource: DataSource): Promise<void>;
}

/**
 * Base Seeder Class
 * Provides common functionality for seeders
 */
export abstract class BaseSeeder implements ISeeder {
  /**
   * Run the seeder
   */
  abstract run(dataSource: DataSource): Promise<void>;

  /**
   * Helper: Clear table data
   */
  protected async clearTable(dataSource: DataSource, tableName: string, schema?: string): Promise<void> {
    const fullTableName = schema ? `"${schema}"."${tableName}"` : `"${tableName}"`;
    await dataSource.query(`DELETE FROM ${fullTableName}`);
    console.log(`  🗑️  Cleared table: ${fullTableName}`);
  }

  /**
   * Helper: Get repository
   */
  protected getRepository<T extends ObjectLiteral>(
    dataSource: DataSource,
    entity: any,
  ) {
    return dataSource.getRepository<T>(entity);
  }

  /**
   * Helper: Log seeding
   */
  protected log(message: string): void {
    console.log(`  ${message}`);
  }
}