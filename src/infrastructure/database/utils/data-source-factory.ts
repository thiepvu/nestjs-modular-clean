import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from '../config/database.config';
import { ModuleSchemaInfo } from './module-schema-scanner';

/**
 * DataSource Factory
 * Creates reusable DataSource instances for modules
 * Supports both ModuleInfo (entities) and ModuleSchemaInfo (schemas)
 */
export class DataSourceFactory {
  /**
   * Create DataSource for a specific module using schemas
   */
  static createModuleDataSourceFromSchemas(
    moduleInfo: ModuleSchemaInfo,
    options: Omit<DataSourceOptions, 'password' | 'type' | 'host' | 'port' | 'username' | 'database'> = {},
  ): DataSource {
    const config: DataSourceOptions = {
      type: DatabaseConfig.DB_TYPE,
      host: process.env[DatabaseConfig.ENV_KEYS.DB_HOST] || DatabaseConfig.DEFAULTS.DB_HOST,
      port: parseInt(
        process.env[DatabaseConfig.ENV_KEYS.DB_PORT] || String(DatabaseConfig.DEFAULTS.DB_PORT),
        10,
      ),
      username: process.env[DatabaseConfig.ENV_KEYS.DB_USERNAME] || DatabaseConfig.DEFAULTS.DB_USERNAME,
      password: process.env[DatabaseConfig.ENV_KEYS.DB_PASSWORD] || DatabaseConfig.DEFAULTS.DB_PASSWORD,
      database: process.env[DatabaseConfig.ENV_KEYS.DB_DATABASE] || DatabaseConfig.DEFAULTS.DB_DATABASE,
      schema: moduleInfo.schema,
      entities: moduleInfo.schemas, // schemas are entities
      synchronize: false,
      logging: process.env[DatabaseConfig.ENV_KEYS.NODE_ENV] === 'development',
      ...options,
    };

    return new DataSource(config);
  }

  /**
   * Create DataSource for module with migrations using schemas
   */
  static createModuleDataSourceWithMigrationsFromSchemas(
    moduleInfo: ModuleSchemaInfo,
    migrationFiles: string[],
    options: Partial<DataSourceOptions> = {},
  ): DataSource {
    return this.createModuleDataSourceFromSchemas(moduleInfo, {
      migrations: migrationFiles,
      migrationsTableName: DatabaseConfig.getMigrationTableName(moduleInfo.name),
      ...options,
    });
  }

  /**
   * Create DataSource for all modules (application-wide)
   */
  static createApplicationDataSource(
    entities: any[],
    options: Omit<DataSourceOptions, 'password' | 'type' | 'host' | 'port' | 'username' | 'database'> = {},
  ): DataSource {
    const config: DataSourceOptions = {
      type: DatabaseConfig.DB_TYPE,
      host: process.env[DatabaseConfig.ENV_KEYS.DB_HOST] || DatabaseConfig.DEFAULTS.DB_HOST,
      port: parseInt(
        process.env[DatabaseConfig.ENV_KEYS.DB_PORT] || String(DatabaseConfig.DEFAULTS.DB_PORT),
        10,
      ),
      username: process.env[DatabaseConfig.ENV_KEYS.DB_USERNAME] || DatabaseConfig.DEFAULTS.DB_USERNAME,
      password: process.env[DatabaseConfig.ENV_KEYS.DB_PASSWORD] || DatabaseConfig.DEFAULTS.DB_PASSWORD,
      database: process.env[DatabaseConfig.ENV_KEYS.DB_DATABASE] || DatabaseConfig.DEFAULTS.DB_DATABASE,
      entities,
      synchronize: false,
      logging: process.env[DatabaseConfig.ENV_KEYS.NODE_ENV] === 'development',
      ...options,
    };

    return new DataSource(config);
  }

}