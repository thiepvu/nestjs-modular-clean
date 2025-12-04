import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ModuleSchemaInfo } from './module-schema-scanner';
import { DatabaseConfig } from '../config/database.config';
import { DataSourceFactory } from './data-source-factory';

/**
 * Migration Generator for Modules
 * Generates migrations per module in separate folders
 * Now uses EntitySchema instead of decorator-based entities
 */
export class MigrationGenerator {
  private readonly migrationsBasePath: string;

  constructor(migrationsBasePath?: string) {
    this.migrationsBasePath = migrationsBasePath || DatabaseConfig.MIGRATIONS_BASE_PATH;
  }

  /**
   * Generate migration for a specific module
   */
  async generateMigration(
    moduleInfo: ModuleSchemaInfo,
    migrationName: string,
  ): Promise<string | null> {
    const timestamp = Date.now();
    const moduleMigrationsPath = DatabaseConfig.getModuleMigrationsPath(moduleInfo.name);

    // Create module migrations directory if it doesn't exist
    if (!fs.existsSync(moduleMigrationsPath)) {
      fs.mkdirSync(moduleMigrationsPath, { recursive: true });
    }

    // Create DataSource for this module using factory with schemas
    const dataSource = DataSourceFactory.createModuleDataSourceFromSchemas(moduleInfo);

    try {
      await dataSource.initialize();

      // Generate migration using TypeORM
      const sqlInMemory = await dataSource.driver.createSchemaBuilder().log();
      
      if (sqlInMemory.upQueries.length === 0) {
        console.log(`No changes detected for module: ${moduleInfo.name}`);
        await dataSource.destroy();
        return null;
      }

      // Create migration file
      const migrationFileName = `${timestamp}-${this.kebabCase(migrationName)}${DatabaseConfig.MIGRATION_FILE_EXTENSION}`;
      const migrationFilePath = path.join(moduleMigrationsPath, migrationFileName);
      
      const migrationContent = this.generateMigrationContent(
        moduleInfo,
        migrationName,
        timestamp,
        sqlInMemory.upQueries,
        sqlInMemory.downQueries,
      );

      fs.writeFileSync(migrationFilePath, migrationContent);
      
      console.log(`✓ Migration generated: ${migrationFilePath}`);
      
      await dataSource.destroy();
      return migrationFilePath;
    } catch (error) {
      await dataSource.destroy();
      throw error;
    }
  }

  /**
   * Generate migrations for all modules
   */
  async generateAllMigrations(
    modules: ModuleSchemaInfo[],
    baseMigrationName: string = 'auto-generated',
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    for (const module of modules) {
      try {
        const migrationName = `${baseMigrationName}-${module.name}`;
        const filePath = await this.generateMigration(module, migrationName);
        if (filePath) {
          results.set(module.name, filePath);
        }
      } catch (error) {
        console.error(`Error generating migration for ${module.name}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Generate migration file content
   */
  private generateMigrationContent(
    moduleInfo: ModuleSchemaInfo,
    migrationName: string,
    timestamp: number,
    upQueries: any[],
    downQueries: any[],
  ): string {
    const className = this.pascalCase(migrationName) + timestamp;

    return `import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration for ${moduleInfo.name} module
 * Schema: ${moduleInfo.schema}
 */
export class ${className} implements MigrationInterface {
  name = '${className}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if not exists
    await queryRunner.query(\`CREATE SCHEMA IF NOT EXISTS "${moduleInfo.schema}"\`);

${upQueries.map(q => `    await queryRunner.query(\`${q.query.replace(/`/g, '\\`')}\`);`).join('\n')}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
${downQueries.map(q => `    await queryRunner.query(\`${q.query.replace(/`/g, '\\`')}\`);`).join('\n')}
    
    // Note: We don't drop the schema in down migration to prevent data loss
    // await queryRunner.query(\`DROP SCHEMA IF EXISTS "${moduleInfo.schema}" CASCADE\`);
  }
}
`;
  }

  /**
   * Convert string to kebab-case
   */
  private kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Convert string to PascalCase
   */
  private pascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  }

  /**
   * List all migrations for a module
   */
  listModuleMigrations(moduleName: string): string[] {
    const moduleMigrationsPath = DatabaseConfig.getModuleMigrationsPath(moduleName);
    
    if (!fs.existsSync(moduleMigrationsPath)) {
      return [];
    }

    return fs.readdirSync(moduleMigrationsPath)
      .filter(file => file.endsWith(DatabaseConfig.MIGRATION_FILE_EXTENSION) || file.endsWith('.js'))
      .sort();
  }

  /**
   * List all migrations grouped by module
   */
  listAllMigrations(): Map<string, string[]> {
    const migrations = new Map<string, string[]>();

    if (!fs.existsSync(this.migrationsBasePath)) {
      return migrations;
    }

    const moduleDirs = fs.readdirSync(this.migrationsBasePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const moduleName of moduleDirs) {
      const moduleMigrations = this.listModuleMigrations(moduleName);
      if (moduleMigrations.length > 0) {
        migrations.set(moduleName, moduleMigrations);
      }
    }

    return migrations;
  }
}