import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from '../config/database.config';
import { ModuleInfo } from './module-entity-scanner';

/**
 * DataSource Factory
 * Creates reusable DataSource instances for modules
 */
export class DataSourceFactory {
  /**
   * Create DataSource for a specific module
   */
  static createModuleDataSource(
    moduleInfo: ModuleInfo,
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
      entities: moduleInfo.entities,
      synchronize: false,
      logging: process.env[DatabaseConfig.ENV_KEYS.NODE_ENV] === 'development',
      ...options,
    };

    return new DataSource(config);
  }

  /**
   * Create DataSource for module with migrations
   */
  static createModuleDataSourceWithMigrations(
    moduleInfo: ModuleInfo,
    migrationFiles: string[],
    options: Omit<DataSourceOptions, 'password' | 'type' | 'host' | 'port' | 'username' | 'database'> = {},
  ): DataSource {
    return this.createModuleDataSource(moduleInfo, {
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

  /**
   * Get base DataSource options
   */
  static getBaseOptions(): Partial<DataSourceOptions> {
    return {
      type: DatabaseConfig.DB_TYPE,
      host: process.env[DatabaseConfig.ENV_KEYS.DB_HOST] || DatabaseConfig.DEFAULTS.DB_HOST,
      port: parseInt(
        process.env[DatabaseConfig.ENV_KEYS.DB_PORT] || String(DatabaseConfig.DEFAULTS.DB_PORT),
        10,
      ),
      username: process.env[DatabaseConfig.ENV_KEYS.DB_USERNAME] || DatabaseConfig.DEFAULTS.DB_USERNAME,
      password: process.env[DatabaseConfig.ENV_KEYS.DB_PASSWORD] || DatabaseConfig.DEFAULTS.DB_PASSWORD,
      database: process.env[DatabaseConfig.ENV_KEYS.DB_DATABASE] || DatabaseConfig.DEFAULTS.DB_DATABASE,
      synchronize: false,
      logging: process.env[DatabaseConfig.ENV_KEYS.NODE_ENV] === 'development',
    };
  }
}