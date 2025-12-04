import * as path from 'path';

/**
 * Database Configuration Constants
 * Centralized configuration for paths and settings
 */
export const DatabaseConfig = {
  /**
   * Base Paths
   */
  BASE_DIR: process.cwd(),
  
  /**
   * Module Paths
   */
  MODULES_PATH: path.join(process.cwd(), 'src', 'modules'),
  
  /**
   * Migration Paths
   */
  MIGRATIONS_BASE_PATH: path.join(process.cwd(), 'src', 'infrastructure', 'database', 'migrations'),
  
  /**
   * Schema Discovery (for EntitySchema pattern)
   * Used by migrations to scan for *.schema.ts files
   */
  SCHEMAS_FOLDER_PATH: path.join('infrastructure', 'persistence'),
  SCHEMA_FILE_SUFFIX: '.schema.ts',
  SCHEMA_FILE_SUFFIX_JS: '.schema.js',
  
  /**
   * Database Connection
   */
  DB_TYPE: 'postgres' as const,
  DEFAULT_SCHEMA_SUFFIX: '_schema',
  
  /**
   * Migration Settings
   */
  MIGRATION_TABLE_PREFIX: 'migrations_',
  MIGRATION_FILE_EXTENSION: '.ts',
  
  /**
   * Environment Keys
   */
  ENV_KEYS: {
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_USERNAME: 'DB_USERNAME',
    DB_PASSWORD: 'DB_PASSWORD',
    DB_DATABASE: 'DB_DATABASE',
    NODE_ENV: 'NODE_ENV',
  },
  
  /**
   * Default Values
   */
  DEFAULTS: {
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_USERNAME: 'postgres',
    DB_PASSWORD: 'postgres',
    DB_DATABASE: 'modular_monolith',
  },
  
  /**
   * Get schema name for a module
   */
  getSchemaName(moduleName: string): string {
    const envKey = `DB_${moduleName.toUpperCase()}_SCHEMA`;
    return process.env[envKey] || `${moduleName}${this.DEFAULT_SCHEMA_SUFFIX}`;
  },
  
  /**
   * Get migration table name for a module
   */
  getMigrationTableName(moduleName: string): string {
    return `${this.MIGRATION_TABLE_PREFIX}${moduleName}`;
  },
  
  /**
   * Get schemas path for a module (for EntitySchema pattern)
   */
  getModuleSchemasPath(moduleName: string): string {
    return path.join(this.MODULES_PATH, moduleName, this.SCHEMAS_FOLDER_PATH);
  },
  
  /**
   * Get migrations path for a module
   */
  getModuleMigrationsPath(moduleName: string): string {
    return path.join(this.MIGRATIONS_BASE_PATH, moduleName);
  },
  
  /**
   * Get module path
   */
  getModulePath(moduleName: string): string {
    return path.join(this.MODULES_PATH, moduleName);
  },
} as const;

export default DatabaseConfig;